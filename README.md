
  

  


  

  ![Taxi Service](https://raw.githubusercontent.com/MahdiEbrp/images/main/Taxi%20Service.jpg)
# Welcome to Taxi Service!

As a programmer, I have created a valuable taxi booking project that was initially designed for recruitment purposes but evolved into a more serious and impactful undertaking. This simple yet sophisticated project is multilingual and easily customizable, making it a versatile solution for businesses in the transportation industry. Its functionality and attention to detail make it a valuable asset for anyone looking to improve their transportation services.

  

  

## Features

  

1. "Easy access anywhere, anytime is a key benefit of the digital age. With the right technology, you can access almost any kind of content from any device, at any time."

2. "Creating a multi-user website can be a great way to engage more users and provide more functionality. It allows users to collaborate and communicate with each other, creating an interactive experience."

3. "Creating a multilingual website is an important step in reaching more people around the world. By offering content in different languages, you can make your website more accessible to a larger audience."

4. "Easy real-time taxi services are becoming increasingly popular, due to the convenience and ease of use they provide. With a few taps of your finger, you can have an available ride arrive at your location quickly."

5. "Personnel management and support are essential aspects of a successful taxi service website. They ensure that customers receive the best possible experience when using the website and also assist with the daily operations of the business."

  

## Packages

  

  

1. "The application boasts a highly intuitive and robust user interface that is built using React, a widely-used JavaScript library, and Mui, a powerful UI components library, enabling users to interact with the application seamlessly."

  

2. "With the aid of MomentJs, a popular JavaScript library for manipulating dates and times, the application efficiently displays data history locally in a user-friendly manner, enhancing its accessibility and readability."

  

3. "The application utilizes Leaflet, an open-source library for interactive maps, allowing users to visualize data geographically, thus improving their understanding and analysis of the data."

  

4. "By incorporating SWR, a lightweight React Hooks library for remote data fetching, the application ensures automatic updates of data, providing real-time information to users and keeping them informed of any changes."

  

5. "Through Nodemailer, a module for Node.js applications that allows sending emails, the application offers seamless email functionality, enabling to send emails within the application with ease."

  

6. "With Next Auth and Google Recaptcha, the application provides secure multi-user access and authentication, enabling authorized individuals to use the application safely and securely."

  

7. "The application leverages ORM Prism, a library designed to simplify the management of databases, ensuring efficient database organization and optimizing data retrieval and storage."

  

8. "Using PostgresSQL, a powerful, open-source relational database management system, the application achieves reliable data storage and scalable data management, contributing to the overall performance of the application."


# Environment Variables Setup

When developing an application, it's important to keep sensitive information secure and separate from your codebase. Instead of storing these values directly in your project files, consider using environment variables to provide your application with the necessary configuration.

Here are some common environment variables used in web development:

## DATABASE_URL

The `DATABASE_URL` environment variable provides your application with the connection string required to connect to a database. For example, if you're using a PostgreSQL database, the URL might look like this:

`postgres://user:password@localhost:5432/mydatabase` 

## NEXT_PUBLIC_RECAPTCHA_SITE_KEY

`NEXT_PUBLIC_RECAPTCHA_SITE_KEY` is used to configure reCAPTCHA v3 site key, which is a free service provided by Google that protects your website from spam and abuse.

## NEXT_PUBLIC_WEB_URL

The `NEXT_PUBLIC_WEB_URL` environment variable is used to define the public URL for your application, including the protocol (i.e., http or https) and domain name.

`NEXT_PUBLIC_WEB_URL=https://example.com` 

## NEXT_PUBLIC_ROOT_DOMAIN

The `NEXT_PUBLIC_ROOT_DOMAIN` variable defines the root domain of your application, for instance, `example.com`.

## RECAPTCHA_SECRET_KEY

`RECAPTCHA_SECRET_KEY` is the secret key that goes with the `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`, used to validate reCAPTCHA responses generated by the user.

## NEXT_AUTH_SECRET

The `NEXT_AUTH_SECRET` environment variable is used to define a shared secret for NextAuth.js authentication to ensure session security.

## ENCRYPTION_PASSWORD_SALT

The `ENCRYPTION_PASSWORD_SALT` environment variable is used to define the salt value for password encryption and decryption.

## ENCRYPTION_DATA_SALT

The `ENCRYPTION_DATA_SALT` environment variable is used to define the salt value for data encryption and decryption.

## EMAIL_SENDER_USER

The `EMAIL_SENDER_USER` environment variable is used to store the email account username for the email sender.

## EMAIL_SENDER_PASSWORD

The `EMAIL_SENDER_PASSWORD` environment variable is used to store the email account password for the email sender.

## EMAIL_SENDER_SMTP_HOST

The `EMAIL_SENDER_SMTP_HOST` environment variable is used to store the SMTP server host for the email sender.

## DEVELOPER_MODE

The `DEVELOPER_MODE` environment variable is used to switch to developer mode in the application, where certain features may be enabled or disabled.

Once you've defined these environment variables, you can access them in your application using `process.env.MY_VARIABLE_NAME`.

For example:

`const dbConfig = {
  connectionString: process.env.DATABASE_URL,
};` 

By using environment variables, you can keep sensitive information secure, make your application more portable, and easily configure your application for different environments.


  

## Wiki

  
 I am pleased to inform you that I have create a wiki for this React project, complete with all the necessary information. You can access this resource via the following URL:["https://github.com/MahdiEbrp/taxiservice/wiki"](https://github.com/MahdiEbrp/taxiservice/wiki).