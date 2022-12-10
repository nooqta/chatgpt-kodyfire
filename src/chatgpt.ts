import { IConcept, ITechnology } from 'kodyfire-core';
import { join, relative } from 'path';
import { strings } from '@angular-devkit/core';
const pluralize = require('pluralize');
import { ChatGPTAPI } from './chatgpt/';

import { Concept as BaseConcept } from 'basic-kodyfire';
import { Engine } from './engine';
export class Chatgpt extends BaseConcept {
  extension = '.kody'; // replace with your extension
  params: any;
  constructor(concept: Partial<IConcept>, technology: ITechnology) {
    super(concept, technology);
    this.engine = new Engine();
    this.params = technology.params;
    // Register functions you want to use in your templates with the engine builder registerHelper method.
    this.engine.builder.registerHelper('uppercase', (value: any) => {
      return value.toUpperCase();
    });
    this.engine.builder.registerHelper('pluralize', (value: any) => {
      return pluralize(value);
    });
    this.engine.builder.registerHelper('lowercase', (value: any) => {
      return value?.toLowerCase();
    });

    for (const key in strings) {
      this.engine.builder.registerHelper(key, (value: any) => {
        /* @ts-ignore */
        return strings[key](value);
      });
    }
  }

  async generate(_data: any) {
    const { name: topic } = _data;
    if(!topic) throw new Error('Please provide a topic to chat with the bot');
    // We check if the user has provided a session token
    if (!this.params.env || !this.params.env.SESSION_TOKEN) {
      throw new Error('Make sure you provide a session token in your .env file. ie: SESSION_TOKEN=your-session-token')
    }
    const {SESSION_TOKEN: apiKey} = this.params.env

    // create a new API instance
    const api = new ChatGPTAPI({
      sessionToken: apiKey,

    })
  
    // ensure the API is properly authenticated
    await api.ensureAuth()
  
    // send a message and wait for the response
    const response = await api.sendMessage(
      topic
    )
  
    // response is a markdown-formatted string
    console.log(response)
    process.exit(0);
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

  // resolve template name if it does not have template extension
  resolveTemplateName(templateName: string, name: string) {
    if (templateName.includes('.template')) return templateName;
    // The format of a template : {conceptName}.{templateName}.{extension}.template
    // example : concept.api.php.template
    return `${name.toLowerCase()}.${templateName}${this.extension}.template`;
  }

  getFilename(data: any) {
    if (data.filename) return data.filename;
    return join(
      data.outputDir,
      `${data.name}.${data.extension || this.getExtension(data.template)}`
    );
  }

  getExtension(templateName: string) {
    return templateName.replace('.template', '').split('.').pop();
  }

  getTemplatesPath(): string {
    return this.technology.params.templatesPath
      ? this.technology.params.templatesPath
      : relative(process.cwd(), __dirname);
  }
}
