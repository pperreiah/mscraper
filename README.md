# mhscraper

Miami Herald.com MongoDB Web Scraper

heroku deployment: https://dashboard.heroku.com/apps/arcane-reef-27073 
github repository: https://github.com/pperreiah/mscraper/

This website scraper gathers headline news from the MiamiHerald.com website and saves it to a mongoDB database.  Article titels and hyperlinks are displayed.  Articles can then be read and notes attached.

An MVC Model is deployed.  Database interactions are managed in the miamiheraldscraper_controller.js file.

Handlebars are used to render the 'Main', 'Scraped Articles' and 'Saved Articles Views'

Note that the Miami Herald does not feature article summaries on its website.

Enjoy the sunny news from Miami!
