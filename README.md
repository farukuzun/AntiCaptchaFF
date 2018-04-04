# AntiCaptchaFF

I usually try to avoid Google products for privacy reasons. But they have one product that became widespread like cancer figuratively and literally, **reCaptcha**. It's just an illusion of security which destroys all usability.

This project uses [AntiCaptcha API](https://anti-captcha.com/) for solve and bypass reCaptcha. Since defeating reCaptcha's audio challenges is not [hard to implement](https://github.com/ecthros/uncaptcha), Google usually doesn't allow you to [use it.](https://instaud.io/1ZAC) This project aims to help people with disabilities and people who tired of solving challenges.

## How it works

![how it works](https://raw.githubusercontent.com/farukuzun/AntiCaptchaFF/master/mermaid_output.png)

## Roadmap

-  Get listed on addons.mozilla.org
-  Tor Browser (an .onion API URL) Support 
-  Proxy Support (It's already there but you need to set up your own proxy, not needed for now)
-  Capture more challenges:


|Captcha Type           | Status                         
|-----------------------|-------------------------------|
|Standart reCaptcha     |works                          |
|Cloudflare Challenges   |planned                       |


## Installation

Right now we don't have any releases. So fork this repo, edit `YourAntiCaptchaKey` in [background.js](https://github.com/farukuzun/AntiCaptchaFF/blob/master/scripts/background/background.js). Go to`about:debugging` and install it from there.

## Usage

Click icon on your browser to turn on/off automatic usage. If plugin is turned off, you can use key combination: `CTRL+SHIFT+9` on a challenge page.

## Privacy

We collect nothing from you. But don't trust, verify. You can feel free to examine source code. For extension to work we have to send following things to Anti-Captcha API.

- Url = `window.location.href`
- reCaptcha's sitekey


## Thanks 

[KikBits](http://kikbits.com/)
[Anti-Captcha](https://anti-captcha.com/)