# ChatGPT-kodyfire
![Version](https://img.shields.io/badge/version-0.1.1-blue.svg?cacheSeconds=2592000)
[![Documentation](https://img.shields.io/badge/documentation-yes-brightgreen.svg)](https://github.com/nooqta/kodyfire#install-a-kody)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/nooqta/kodyfire/blob/main/LICENSE)

> Interact with chatGPT chat bot. saves the converation into word, pdf, excel and more using [Kodyfire](https://github.com/nooqta/kodyfire).

### [Homepage](https://github.com/nooqta/kodyfire)

## Requirements

chatgpt-kodyfire requires the [kodyfire-cli](https://github.com/nooqta/kodyfire) to be installed

```sh
npm install -g kodyfire-cli
```
## Install

```sh
npm i chatgpt-kodyfire
```

## Usage

### Method 1: As a generator
In order to generate your artifacts, run the `generate` command. The syntax is `kody generate|g [kody] [concept]`. If you ommit `kody` and `concept` the assistant will prompt you to select them. As an example, run the following command from your terminal:
```sh
kody generate chatgpt chatgpt
```

### Available concepts 

#### `chatgpt` (default)
> Initiate a new chat session and saves the output to the target

##### Usage
```bash
kody g chatgpt chatgpt
# or the colon syntax
kody g chatgpt:chatgpt
```
##### Arguments

- `kody` _string_ - The name of the kody. ChatGPT in our case. You can have multiple kodies installed. To list your installed kodies with your project run `kody list`
- `concept` _string_ - The name of the concept you want to execute. To list the concepts of your installed kody (chatgpt), run `kody list chatgpt` 
- `topic` _string_ - The topic question to start the conversation.




## 📅 Future Features
- Output conversation to a text file
- Output conversation to Word
- Output conversation to Excel or CSV

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
# chatgpt-kodyfire
