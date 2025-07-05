# C.L.A.W. (**C**hain **L**ynx **A**nalytics **W**ebtool)

![Vercel](https://vercelbadge.vercel.app/api/ChainLynxRobotics/ScoutingPWA?style=for-the-badge)

### *A Progressive Web App (PWA) built with React to scout FIRST robotics competition matches.*

---
### ⚠️ Note: This application is only to be used by FRC Team 8248 and FRC Team 4180 ⚠️
This may change in the future, but for now we ask that usage of this app is closed to other teams.


## Screenshots:
<img src="./repo/scout_match.png?raw=true" alt="A screenshot showing the scouting application in-use" width="200px" /> <img src="./repo/analytics_graph.png?raw=true" alt="A screenshot showing the analytics section of the scouting application in-use" width="200px" /> <img src="./repo/analytics_picklist.png?raw=true" alt="A screenshot showing the pick list" width="200px" />

## Features
- Once installed, it can work **fully** offline
- Everything can be done on a phone, built for mobile compatibility
- All data can be sent via QR codes and [Bluetooth radio](https://github.com/ChainLynxRobotics/CLAW-RadioFirmware)
  - Including scouting data, match schedule, and pick list
  - Data is heavily compressed to make transfer as fast as possible
- Calculations and graphs are integrated in-app
  - They can also be exported into csv/json files for easy data transfer and custom statistic calculations
- Team Pick List with easy data viewing
  - Draggable teams for the current competition
  - The Pick List can be shared with others via a QR code for collaborative ranking.
- If Internet is available, match schedule and team rankings can be pulled from [TBA API](https://www.thebluealliance.com/apidocs)

### Limitations
- As this app is built to be used offline, all scouters must share qr codes with the scout lead every so often for them to collect the data, or use the bluetooth radio
- Bluetooth is not available on IPhones due to iOS restrictions (WebBluetooth API not allowed)
- UI is not super intuitive, and requires some practice before using in-competition
- Two scouters can not scout the same team during the same match
  - Due to its time-based nature, the data cannot be combined or averaged out in any reasonable way
- Managing of who is scouting and their Client ID must be done manually
- May not work on old phones/tablets, requires modern browser features
- Although everything *can* be transferred with just text codes/files over slack or alt platforms, a high res phone camera is highly recommended for the scout lead to gather data from scouters quickly.
- No way of pit scouting (for now...)


## How to Scout

### Getting Set Up

The majority of a scouter's time will be spent on the main scouting page page, this is where the data is collected and most inputs are located.

When you pull out your phone or are given a tablet to start scouting, you must verify these things:
- You have selected the correct <a href="#managing-client-ids">Client ID</a>, changed in settings
- You are on the right match number, change this in the select menu on the pre-scout page
- You have set your name on the Settings Page, this is not required but used to track your contributions

---

### Pre Match

The Pre-match screen is for filling in data/notes for before the match starts. <u>**Pay attention for that buzzer because the moment autonomous starts, you need to hit the "Start Match" button to ensure all the time-based data is synced.**</u>

---

### During the Match

When that button is pressed, you will be navigated to the during-match screen, displaying buttons at the different field elements to press when your assigned robot completes different tasks. Everything recorded in the first 18 seconds is assumed to be in autonomous mode, however you may forcefully skip into tele-op with a skip button in the top right.

The timing of the button presses is recorded, but its ok if the timing is off. Whats more important is that the button gets pressed at all, even if its five seconds delayed or a hundred seconds delayed. Remember that this data is recorded by humans and interpreted by humans, its OK to make mistakes!

**TIP:** Depending on the perspective you are currently viewing the field from, a rotate button in the top left will flip around the diagram and buttons to account for where you may be in the stands.

Additionally, an editable Event Log is provided to make quick edits/deletions during the match. However it is recommended to make those edits once the match is over due to the fast paced nature of the games.

---

### Post Match

This is the time to fill in extra notes, observations, and end-game data. Additionally, this is the prime time to create/edit/delete any events in the event log before the data is submitted.

---

### Onto the next scouter

After you have scouted a few times, you should relinquish the task to another team member. If the scouting lead is nearby or available, be sure to navigate to the Data Page and <a href="#transferring-data">generate QR Codes</a> so they can collect your data. 

**TIP:** If the lead is not available, you can also share this data with the next scouter who can then pass it on to the lead when they have a chance.

Next you want to notify your replacement of your Client ID, and make sure they set the correct one in settings. Also make sure they have the correct match number selected.

Finally give them a pat on the back, wish them luck, and enjoy your sweet sweet escape to freedom (or the pits... I still get shivers just thinking about that dreadful place...)

<img src="./repo/scout_pre.png?raw=true" alt="A screenshot showing the scouting pre-match page of the application" width="200px" /> <img src="./repo/scout_match.png?raw=true" alt="A screenshot showing the during match page of scouting application in-use" width="200px" /> <img src="./repo/scout_post.png?raw=true" alt="A screenshot showing the post match page of the scouting application in-use" width="200px" />


# As a Scout Lead

### Getting the Event Schedule

All schedule management is done on the Settings Page.

If internet access is available nearby, its recommended to tell your scouters to use the "Download From BlueAlliance" button to get a copy of the schedule from TBA API. Those who have the schedule can also <a href="#transferring-data">share it with others</a> with a similar QR system to the matches, using the "Scan" and "Share" buttons above the match schedule.

<img src="./repo/settings_schedule.png?raw=true" alt="A screenshot showing the schedule section of the settings page" width="200px" />

---

### Managing Client IDs

The Client ID (1-6) determines what robot each person will be scouting, and must be unique for every active scouter to avoid duplicate data. A good method our team found, was to get 6 pieces of paper with the numbers 1-6 on them and each active scouter would hold on to the piece, both so the lead new who they needed data from, and so when scouters were replaced they knew what Client ID to use.

---

### Transferring data

Every few matches during the competition, ask each of your scouters to share their data with you. This is done by navigating to the Data Page and pressing the blue "Share" button at the top. This will generate QR Codes that contain all of their new match data. As a lead you want to press the "Collect" button to open a QR Scanner to scan those codes.

**NOTE:** The "Share" button will only generate codes for matches that have not already been shared (aka "New" matches). To include other matches, select them in the Data Page and press the "Mark As New" button before generating.

For transferring large amounts of data, you may also export everything as a .zip file with the "Export" button. That file may then be sent to another person via slack or alt application to the receiver who can when import that file with the "Import" button to get a copy of all those matches.

<img src="./repo/data.png?raw=true" alt="A screenshot data page of the scouting application in-use" width="200px" />

---

### Visualizing the Data

The analytics page is built just for this! It uses the data on the current device to calculate statistics and generate colorful charts to easily take advantage of the data your team has collected.

**TIP:** While it is compatible with mobile devices, its recommended to use a landscape device for maximum data consumption.

The "Teams" and "Matches" tabs on the main Analytics Page show a list of all known teams and matches you have data on. A checkbox at the top of the page will limit this to only include data from the current competition. The teams can be starred for repeated access and clicking on them will lead you to all the colorful numbers you could ever need.

The Pick List tab is similar to the Teams tab but allows you to reorder and rank different teams for alliance selection. You may also cross off teams for your convenience during the selection itself. Your order of teams can be shared with other members both with the <a href="#transferring-data">QR system described earlier</a> and copy+pasting a short Data Transfer Code.

<img src="./repo/analytics_base.png?raw=true" alt="A screenshot showing the default Teams tab of the analytics page." width="200px" /> <img src="./repo/analytics_team.png?raw=true" alt="A screenshot showing the data visualization for an example team" width="200px" /> <img src="./repo/analytics_picklist.png?raw=true" alt="A screenshot showing the pick list tab of the analytics page" width="200px" />

<img src="./repo/analytics_full.png?raw=true" alt="A screenshot showing the full analytics visualization in a landscape view" width="600px" />



# Developing

### Required Programs
- [NodeJS](https://nodejs.org/en), a JavaScript Engine
- [pnpm](https://pnpm.io/installation#using-corepack), a package manager for handling libraries
  - Its recommended to use `corepack enable pnpm` install install it, corepack is included in the NodeJS install
- [Git](https://git-scm.com/), for source control
  - I personally recommend installing it through the [Github CLI](https://cli.github.com/) for easy github sign-in
  
### Recommended Programs
- [VSCode](https://code.visualstudio.com/Download), an all around IDE
  - Recommended Extensions:
    - [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)

### Project Setup

Download and navigate to the repo:
```shell
git clone https://github.com/ChainLynxRobotics/CLAW-ScoutingPWA
cd CLAW-ScoutingPWA
```

Install the libraries with pnpm:
```shell
pnpm install
```

### Commands

Start the dev server:
```shell
pnpm run dev
```

Run [eslint](https://eslint.org/):
```shell
pnpm run lint
```

Build the project and preview it:
```shell
pnpm run build
pnpm run preview
```

## Project Structure

Notable libraries used:
- [TypeScript](https://www.typescriptlang.org/) - Lets us add types to JS for type safety and easier development
- [Vite](https://vite.dev/guide/) - The frontend tooling library powering the dev server, building for the browser, and providing an easy developer experience for modern web projects.
- [React](https://react.dev/learn) - The frontend framework that allows us to write everything in components
- [React Router](https://reactrouter.com/en/6.28.1/) - Allows a react project to work across multiple pages and render different components based on the URL
- [Tailwindcss](https://tailwindcss.com/) - Allows us to avoid css and write all of our styles with dynamic classes, and the final css bundle only includes the ones we need
- [Protocol Buffers](https://protobuf.dev/overview/) - Used for encoding JSON data for scouting data into a more efficient binary format for smaller qr codes and packets during data transfer
- [Vite PWA](https://vite-pwa-org.netlify.app/) - Plugin to bundle all the code as a [Progressive Web App (PWA)](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps) which allows it to work offline and be installed as an app.
- [ESLint](https://eslint.org/) - Code checking for following good conventions and finding possible bugs, ran with `pnpm run lint`

And many more defined in [`package.json`](/package.json)

### Directories

- [`public/`](/public/) - All the publicly available non-code files such as images for the client to download and use
  - [`fonts/`](/public/fonts/) - The font files that are fetched in [index.css](/src/index.css)
  - [`imgs/`](/public/imgs/) - Take a wild guess on what this is used for
  - [`protobuf/`](/public/protobuf/) - [Protocol buffer definition files](https://protobuf.dev/programming-guides/proto3/) for encoding json in a more efficient binary format, and downloaded by [proto.ts](/src/util/io/proto.ts)
- [`src/`](/src/) - Where all the code lives, must be followed or else vite and tailwind will not recognize it, all the other folders in side of this are not strictly required but are for good code style
  - [`components/`](/src/components/) - React [components](https://react.dev/learn/tutorial-tic-tac-toe#passing-data-through-props) for the rest of the app
    - [`analytics/`](/src/components/analytics/) - Components for stats and graphs on the [analytics pages](/src/pages/analytics/)
    - [`context/`](/src/components/context/) - React [context](https://react.dev/learn/passing-data-deeply-with-context) and context provider components that provide the app with global states such as scouting data and settings, see [main.tsx](/src/main.tsx) for where they are used
    - [`hooks/`](/src/components/hooks/) - React [hooks](https://react.dev/learn/reusing-logic-with-custom-hooks#) for reusable logic
    - [`qr/`](/src/components/qr/) - Components for QR code list and scanner
    - [`ui/`](/src/components/ui/) - Small components used repeatedly for the ui of the app
  - [`enums/`](/src/enums/) - Typescript [enums](https://www.typescriptlang.org/docs/handbook/enums.html) for the app
  - [`pages/`](/src/pages/) - React components for all the pages and layouts, see [main.tsx](/src/main.tsx) and the [react router docs](https://reactrouter.com/6.28.1/router-components/browser-router)
  - [`types/`](/src/types/) - [Typescript types](https://www.typescriptlang.org/docs/handbook/intro.html), aka defining interfaces for the rest of the app to use for type safety
  - [`util/`](/src/util/) - Utility classes and functions
    - [`analytics`](/src/util/analytics/) - Any repeated functions the [analytics pages](/src/pages/analytics/) might need
    - [`db/`](/src/util/db/) - The database functions for storing match data in the browser's [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB) using the [idb](https://github.com/jakearchibald/idb) library for easier async operations
    - [`io/`](/src/util/io/) - The Input/Output (IO) operations for the app, such as importing, exporting, [compressing](https://developer.mozilla.org/en-US/docs/Web/API/Compression_Streams_API), and [protobuf encoding](https://protobuf.dev/overview/) for qr codes, bluetooth, and zip files.
