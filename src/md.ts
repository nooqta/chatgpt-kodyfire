import { IConcept, ITechnology } from "kodyfire-core";
import { join, relative } from "path";
import { strings } from "@angular-devkit/core";
const pluralize = require("pluralize");
import { Concept as BaseConcept } from "basic-kodyfire";
import { Engine } from "./engine";
import { requiresm } from "esm-ts";
import * as dotenv from 'dotenv';

export class Md extends BaseConcept {
  extension = ".md"; // replace with your extension
  params: any;
  constructor(concept: Partial<IConcept>, technology: ITechnology) {
    super(concept, technology);
    dotenv.config();
    this.engine = new Engine();
    this.params = technology.params;
    // Register functions you want to use in your templates with the engine builder registerHelper method.
    this.engine.builder.registerHelper("uppercase", (value: any) => {
      return value.toUpperCase();
    });
    this.engine.builder.registerHelper("pluralize", (value: any) => {
      return pluralize(value);
    });
    this.engine.builder.registerHelper("lowercase", (value: any) => {
      return value?.toLowerCase();
    });

    for (const key in strings) {
      this.engine.builder.registerHelper(key, (value: any) => {
        /* @ts-ignore */
        return strings[key](value);
      });
    }
  }

  async generate(_data: any, api: any = null, attemps = 0) {
    let prompt = '';
    let thread: any[] = [];
    try {
      let keepConversation = true;
      const prompts = require("prompts");
      const { value } = await prompts(
        {
          type: "text",
          name: "value",
          message: `🤖 Hi there, how can I help you today?\n`,
        },
        {
          onCancel: () => {
            keepConversation = false;
            process.exit(0);
          },
        }
      );
      prompt = value;
      // We check if the user has provided a session token
      if (!this.params.env || !this.params.env.OPENAI_EMAIL) {
        throw new Error(
          "Make sure you provide a Openai credentials in your .env file. \nie: OPENAI_EMAIL=your-openai-email\nOPENAI_PASSWORD=your-openai-password"
        );
      }
      const chatgpt: any = await requiresm("chatgpt");
      const { ChatGPTAPI } = chatgpt;

      // use puppeteer to bypass cloudflare (headful because of captchas)
      if (!api) {
        api = new ChatGPTAPI({
          apiKey: process.env.OPENAI_API_KEY
        })
      }

      // send a message and wait for the response
      // @ts-ignore
      const {oraPromise}: any = (await requiresm("ora"));
      let conversationId,
        parentMessageId = null;
      let res = await oraPromise(api.sendMessage(prompt, {}), {
        text: prompt,
      });
      ({ keepConversation, prompt, thread } = await this.prompt(
        res,
        thread,
        prompts,
        keepConversation,
        prompt
      ));
      
      while (keepConversation) {
        conversationId = res.conversationId;
        parentMessageId = res.messageId;
        res = await oraPromise(
          api.sendMessage(prompt, {
            conversationId,
            parentMessageId,
          }),
          {
            text: prompt,
          }
        );
        // @ts-ignore
        ({ keepConversation, prompt, thread } = await this.prompt(
          res,
          thread,
          prompts,
          keepConversation,
          prompt
        ));
      }
    } catch (error) {
      console.log(error.message);
      if (attemps < 3) {
        attemps++;
        await this.generate(_data, api);
      }
    }
    // @ts-ignore
    _data.thread = thread.join("\\");
    // We resolve the template name here
    _data.template = this.resolveTemplateName(_data.template, this.name);
    const template = await this.engine.read(
      join(this.getTemplatesPath(), this.template.path),
      _data.template
    );

    const compiled = this.engine.compile(template, _data);

    await this.engine.createOrOverwrite(
      this.technology.rootDir,
      this.outputDir,
      this.getFilename(_data),
      compiled
    );
  }

  private async prompt(
    res: any,
    thread: any[],
    prompts: any,
    keepConversation: boolean,
    prompt: any
  ) {
    const { text: response } = res;
    const md = await require("cli-md");
    thread.push(response);
    const { value } = await prompts(
      {
        type: "text",
        name: "value",
        message: `${md(response)}\n`,
      },
      {
        onCancel: () => {
          keepConversation = false;
        },
      }
    );
    prompt = value;
    return { keepConversation, prompt, thread };
  }

  // resolve template name if it does not have template extension
  resolveTemplateName(templateName: string, name: string) {
    if (templateName && templateName.includes(".template")) return templateName;
    // The format of a template : {conceptName}.{templateName}.{extension}.template
    // example : concept.api.php.template
    templateName = templateName ? `.${templateName}` : '';
    return `${name.toLowerCase()}${templateName}${this.extension}.template`;
  }

  getFilename(data: any) {
    if (data.filename) return data.filename;
    return join(
      data.outputDir,
      `${data.name}.${data.extension || this.getExtension(data.template)}`
    );
  }

  getExtension(templateName: string) {
    return templateName.replace(".template", "").split(".").pop();
  }

  getTemplatesPath(): string {
    return this.technology.params.templatesPath
      ? this.technology.params.templatesPath
      : relative(process.cwd(), __dirname);
  }
}
