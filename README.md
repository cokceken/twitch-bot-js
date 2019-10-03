

# Twitch Bot JS

I built this project primarily to understand how to implement twitch bot APIs (microservices), especially using  asking questions and getting answers. Set questions and get answers by users in twitch chat. 

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy and run the project on a live system.

### Prerequisites

What things you need to install the software and how to install them

 - Node.js 
 - Git cli optional - you can download and extract zip file
 - Twtich oauth credentials


### Installing

A step by step series of examples that tell you how to get a development env running



## Clone repo from github
```Bash
git clone https://github.com/cokceken/twitch-bot-js.git
cd twitch-bot-js
```

## Install packages 
```Bash
npm install
```

## Set Configurations
Edit `./configurations.js` fill with your credentials.
```js
{
    username: 'USER_NAME',
    oauth: 'OAUTH:TOKEN',
    channel: 'CHANNEL'
}
```

## Run
```Bash
node bot.js
```

When server is runing terminal window you will get `irc connected` and `Joined channel`

## Deployment

You need a nodejs server like heroku deploy on it than run intance

## Built With

* [TwitchBot](https://www.npmjs.com/package/twitch-bot) - The Twitch framework 
* [lodash](https://www.npmjs.com/package/lodash) - lodash javascript framework


## Authors

* **Semih Çokçeken** - *Initial work* - [cokceken](https://github.com/cokceken)
* **Murat Mayadağ** - *Small touches* - [mmayadag](https://github.com/mmayadag)

See also the list of [contributors](https://github.com/cokceken/twitch-bot-js/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Inspiration
* etc
