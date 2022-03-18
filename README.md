# Pass bokning
This is a helper script to be able to book a time for ordering a passport in Sweden.
This script does not currently support ordering National ID.

## Requirements
Nodejs v17

## Getting started
Create a file `result/config.json`
```js
{
  "persons":[ // Amount of persons to book for. Feel free to add or remove, add empty objects if you want to be anonymous.
    {
      "first": "firstname",
      "last": "lastname"
    }
  ],
  "contact": {
    "email": "your.email@example.com",
    "phone": "0701234567"
  },
  "station": 0, // 0 = all of the passstations in the region, if you want a specific one you need to check it up.
  "region": "uppsala", // Allowed/supported, see Supported regions below.
  "endDate": "2022-05-31" // How long to allow the automated booking to work
}
```

```bash
corepack enable pnpm # Make sure pnpm exists
pnpm install # install dependencies
pnpm run start # runs the command.
```

Once the script succeeds in creating a booking it will create a file called `result/success.json` and any time you run the script with that file existing, the script will close without doing anything.

## Cron
To automate this script run with a similar crontab:
```
*/15 * * * * [PATH_TO_NODE_INSTALL]/bin/node [PATH_TO_REPO]/src/index.mjs > [PATH_TO_REPO]/result/log.txt 2>&1
```

## Supported regions:
* Blekinge Län (`blekinge`)
* Dalarna (`dalarna`)
* Gotland (`gotland`)
* Gävleborg (`gavleborg`)
* Halland (`halland`)
* Jämtland (`jamtland`)
* Jönköping (`jonkoping`)
* Kalmar (`kalmar`)
* Kronoberg (`kronoberg`)
* Norrbottn (`norrbotten`)
* Skåne (`skane`)
* Stockholm (`stockholm`)
* Södermanland (`sodermanland`)
* Uppsala (`uppsala`)
* Värmland (`varmland`)
* Västerbotten (`vasterbotten`)
* Västernorrland (`vasternorrland`)
* Västra Götaland (`vastragotaland`)
* Örebro (`orebro`)
* Östergötland (`ostergotland`)

## How to add region support

Add `personDetailsServices` & `serviceGroupIds` to [src/flow/regionSpecifics.mjs](./src/flow/regionSpecifics.mjs) (and make a PR to this repo). Also remembed to update this readme file above.


### Find personDetailsServices

* Open [https://polisen.se/tjanster-tillstand/pass-och-nationellt-id-kort/boka-tid-hitta-passexpedition/](https://polisen.se/tjanster-tillstand/pass-och-nationellt-id-kort/boka-tid-hitta-passexpedition/)
* Navigate with the link to your region (e.g. [https://bokapass.nemoq.se/Booking/Booking/Index/uppsala](https://bokapass.nemoq.se/Booking/Booking/Index/uppsala))
* Open Networktab in dev tools (`ctrl/cmd`+`shift`+`I`), tick `Preserve Log`.
* (Optional:) Filter for `Doc`.
* Press `Boka ny tid`.
* Select the first `[region]` (post) request (with a 302 Status).
* In the `payload` tab, take note of the `ServiceGroupId` which is the value you need.

### Find serviceGroupIds
* See concepts from above.
* Navigate the form until you come to the `Uppgifter till bokningen` step.
* Fill the form for name and booking type.
* (Optional:) Clear requests history in the dev tools network tab.
* Press `Nästa`.
* In the latest post request (`[region]`, status 302).
* In the `payload` tab, take note of:
  * `Customers[0].Services[0].ServiceId` = `serviceId0`
  * `Customers[0].Services[0].ServiceTextName` = `serviceText0`
  * `Customers[0].Services[1].ServiceId` = `serviceId1`
  * `Customers[0].Services[1].ServiceTextName` = `serviceText1`