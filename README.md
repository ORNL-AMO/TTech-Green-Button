# TN Tech Green Button Initiative

## Overview

The TN Tech Green Button Initiative focuses on solving energy management challenges in line with the Better Plants program. Utilizing the Verifi system developed by ORNL, this application processes data retrieved from utility APIs. It aligns with the Green Button data standard to assist industries in monitoring and verifying energy savings.

![Green Button UI](/TTech-Green-Button/src/assets/images/GreenButton.PNG)


## Features

- Seamless integration with UtilityAPI and adherence to the Green Button standard for energy data acquisition.
- Capabilities to conduct three distinct types of data exports.
- A feature for searching and retrieving new energy data records.

## Setup and Installation

To get started with the Green Button Initiative project on your local system, please follow these steps:

1. Clone the repository: `git clone https://github.com/ORNL-AMO/TTech-Green-Button.git`.
2. Change directory to the project: `cd TTech-Green-Button`.
3. Install necessary dependencies: `npm install`.
4. Launch the development server using `ng serve`. Open `http://localhost:4200/` in your browser. The application will automatically update if any source files are changed.

## Development Commands

- **Code Scaffolding:** Execute `ng generate component component-name` or use other `ng generate` commands to scaffold Angular entities such as directives, pipes, services, and more.
- **Building:** Run `ng build` to compile the project. The compiled output will be found in the `dist/` directory.
- **Running Unit Tests:** Use `ng test` to run unit tests via [Karma](https://karma-runner.github.io).
- **Running End-to-End Tests:** Use `ng e2e` to execute end-to-end tests after setting up the appropriate testing package.

## Authorization Key

Users must obtain a unique authorization key from their UtilityAPI account to use this application. Substitute `<your_key>` in the application with your individual key. 

## Acknowledgments

- Thanks to UtilityAPI for facilitating data integration.