Bank Reports
============

*Parsing Israeli bank account reports to understand where my money goes.*
Currently supported:
1. Banks:
   * Bank Hapoalim
   * Marcentile
   * Bank Leumi
1. Credit:
   * Isracard
   * American Express
In the Future:
1. Salary
1. Keren Hishtalmut
1. Pension
1. BTL

## In order to use the app:
1. Upload your bank account for a specefic month. The system will review it and ask for the missing information.
   * Missing info might be detailed credit card report.
1. Upload any missing info the system requests. 
1. Manually fill the fields you would like to edit. The more you fill in, the better the report will be.

## TODO:
1. create a react frontend and a flask server as an MVP.
   1. upload bank report
   ==vvv DONE vvv==
   1. disect it in the server.
   1. add select for manually editing the report.
      * buissness domain - will be saved on the server for future autofill
   1. add checkbox to remove hide line from report
   1. upload credit card report and disect it in the server.
      * link to bank activity
   
1. create logins using LDAP
1. add budget planning
1. create react native app
   * reminders for budget
   * alerts for budget overdraft
1. add shopping habits and insights
1. add salary upload
   * link to bank activity
1. add pension upload
   * link to bank activity
1. add Keren hishtalmut upload
   * link to salary and bank activity
