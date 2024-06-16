const nodemailer = require('nodemailer')
const pug = require('pug')
const htmlToText = require('html-to-text')
const nodemailMailGun = require('nodemailer-mailgun-transport')

module.exports = class Email {
    constructor(user ,url){
        this.to = user.email
        this.firstName = user.name.split(' ')[0]
        this.url = url
        this.from = `kooroush pasandideh <${process.env.EMAIL_FROM}>`
    }

    newTransport(){
        if(process.env.NODE_ENV === 'production'){
            return nodemailer.createTransport(nodemailMailGun({
                auth : {
                    api_key : process.env.EMAIL_APIKEY
                }
            }))
        }

        return nodemailer.createTransport({
            host : process.env.EMAIL_HOST,
            port : process.env.EMAIL_PORT,
            auth : {
                user : process.env.EMAIL_USERNAME,
                pass : process.env.EMAIL_PASSWORD
            }
        })
    }

    async send(template ,subject){
        
        const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug` ,{
            firstName : this.firstName,
            url : this.url,
            subject
        })
        
        const mailOptions = {
            from : this.from,
            to : this.to,
            subject ,
            html ,
            text : htmlToText.fromString(html)
        }

        await this.newTransport().sendMail(mailOptions)
    }

    async sendWelcome(){
        await this.send('welcome' , 'Welcome to the Natures Family!')
    }

    async sendPasswordReset(){
        await this.send(
            'passwordReser' ,
            'Your password reset token (valid for only 10 min)'
        )
    }
}
