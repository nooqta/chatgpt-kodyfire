# ChatGPT-kodyfire
![Version](https://img.shields.io/badge/version-0.1.7-blue.svg?cacheSeconds=2592000)
[![Documentation](https://img.shields.io/badge/documentation-yes-brightgreen.svg)](https://github.com/nooqta/kodyfire#install-a-kody)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/nooqta/kodyfire/blob/main/LICENSE)

> Interact with the unofficial [ChatGPT](https://openai.com/blog/chatgpt/) API chatbot and export the conversation to Markdown and more using [Kodyfire](https://github.com/nooqta/kodyfire).

### [Homepage](https://github.com/nooqta/kodyfire)

## Requirements

1. [kodyfire-cli](https://github.com/nooqta/kodyfire) to be installed

```sh
npm install -g kodyfire-cli
```

2. Node version >= 18
3. `OPENAI_EMAIL` and `OPENAI_PASSWORD` in .env
these are your [Openai](https://chat.openai.com/auth/login) credentials.
4. The package uses [chatgpt-api](https://github.com/transitive-bullshit/chatgpt-api). Puppeteer is used to handle the authentication. You will need to manually handle any recaptcha. This will probably change once [Openai](https://openai.com/blog/chatgpt/) releases the official api.

## Install

```sh
npm i chatgpt-kodyfire
```


## 
## Usage

In order to generate your exports, run the `generate` command. As an example, run the following command from your terminal:

```sh
kody generate chatgpt:md topic-no-space
```

### Available concepts 

#### `md`
> Initiate a new chat session and saves the output to an md file.
##### Usage
```bash
kody g chatgpt:md topic
```
#### `text`
> Initiate a new chat session and saves the output to a text file.
##### Usage
```bash
kody g chatgpt:text topic
```

#### `tts`
> Initiate a new chat session, save and reads out the response using Google Text-to-speech. The output is also saved to a text file. Requires a google cloud project with the text-to-speech API enabled. Also You need to login using the google cli `gcloud auth application-default login`
##### Usage
```bash
kody g chatgpt:tts topic
```
##### Arguments

- `kody` _string_ - The name of the kody. chatgpt in our case. You can have multiple kodies installed. To list your installed kodies with your project run `kody list`
- `concept` _string_ - The name of the concept you want to execute. To list the concepts of your installed kody (chatgpt), run `kody list chatgpt` 
- `topic` _string_ - The topic question to start the conversation with no spaces. This will be used as filename




## 📅 Future Features
- Output conversation to a text file
- Extract code and save using provided extension
- Output conversation to Word
- Output conversation to Excel or CSV
- Live run code and feedback output back to Chatgpt
- Generate an image using `Dalle`|other and a description provided by chatgpt
- Use Google [https://github.com/googleapis/nodejs-text-to-speech](nodejs-text-to-speech)
- Generate an audio file using Google text-to-speech api

## Author
Anis Marrouchi
* Website: https://noqta.tn
* Twitter: [@anis\_marrouchi](https://twitter.com/anis\_marrouchi)
* GitHub: [@anis-marrouchi](https://github.com/anis-marrouchi)
* LinkedIn: [@marrouchi](https://linkedin.com/in/marrouchi)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!

Feel free to check [issues page](https://github.com/nooqta/chatgpt-kodyfire/issues). 

## Show your support

Give a ⭐️ if this project helped you!

## Credits

- [chatgpt-api](transitive-bullshit/chatgpt-api) by [transitive-bullshit](https://github.com/transitive-bullshit) Node.js client for the unofficial ChatGPT API.
- [kodyfire](https://github.com/nooqta/kodyfire) by [nooqta](https://github.com/nooqta) The kodyfire generator.

## 📝 License

Copyright © 2022 [Anis Marrouchi](https://github.com/anis-marrouchi).

This project is [MIT](https://github.com/nooqta/kodyfire/blob/main/LICENSE) licensed.

***
_This README was generated with ❤️ by [readme-kodyfire](https://github.com/nooqta/readme-kodyfire)_
