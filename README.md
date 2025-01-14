# Passbokning
This is a helper script to be able to book a time for ordering a passport in Sweden.

***Note: This script does not currently support ordering National ID, or persons living abroad.***

After a successful booking you will receive the booking details both by email and sms from the police.
On top of that this script stores the details in the file `result/success.json`.

As long as a file called `result/success.json` (with a `result.bookingNumber`) exists, this script will never attempt to create another booking.

## Requirements
Nodejs v16

## Quick Start
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
  "offsetStart": 0, // UNTESTED PROPERLY On which day to allow bookings, 0 = same day, 1 = day after etc
}
```

Run the following commands, to install required dependencies.

```bash
nvm use # (Optional) If you have nvm installed, to make sure you are using correct nodejs version.
corepack enable pnpm # Make sure pnpm exists
pnpm install # install dependencies
```

Then run one of the following commands to execute the script in one of the modes.

```bash
pnpm run start # runs the command in single mode

pnpm run start:watch # Runs continously until it finds a time, with a reasonable amount of wait between tries.

pnpm run start:agressive # Runs continously until it finds a booking and bombards the API very often. Not recommended.

./src/entry.mjs --help # Helper for info on how to run custom options.

# Start script in watch mode, wait 120 seconds between tries, using custom path for config and custom output for success info.
./src/entry.mjs --watch --timeout 120 --config $(pwd)/result/custom.json --output $(pwd)/result/custom-success.json
```

Once the script succeeds in creating a booking it will create a file called `result/success.json` and any time you run the script with that file existing, the script will close without doing anything.

---

## Configuration
Create a json file with the below mentioned values to be able to run this script.

### Supported regions:
Set the `region` parameter to one of the values in paranthesis.
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
* Västmanland (`vastmanland`)
* Västra Götaland (`vastragotaland`)
* Örebro (`orebro`)
* Östergötland (`ostergotland`)

### Station Id
Set the `station` paramater to either `0`, to allow any station in your region, or a specific station id.  
All the stations id's can be found over [here](./src/flow/stations.mjs).

#### Full way
Set the `station` paramater to either `0`, to allow any station in your region, or a specific station id.  
The station id can be found as below:

* Open [https://polisen.se/tjanster-tillstand/pass-och-nationellt-id-kort/boka-tid-hitta-passexpedition/](https://polisen.se/tjanster-tillstand/pass-och-nationellt-id-kort/boka-tid-hitta-passexpedition/)
* Navigate with the link to your region (e.g. [https://bokapass.nemoq.se/Booking/Booking/Index/uppsala](https://bokapass.nemoq.se/Booking/Booking/Index/uppsala))
* Open Networktab in dev tools (`ctrl/cmd`+`shift`+`I`), tick `Preserve Log`.
* (Optional:) Filter for `Doc`.
* Fill out the form until you come to the page to choose a time.
* Select your preferred station (`Passexpedition`).
* (Optional:) Clear requests history in the dev tools network tab.
* Press either `Sök tid` or `Första Lediga tid`
* Select the latest post request (`[region]`, status 302).
* Select the `payload` tab, take note of `SectionId`, which is your station id.
* In your config (`result/config.json`) set `"station": <your SectionId>`.

### End date
You must always provide an `endDate`, feel free to set it a couple of years into the future if this does not apply to you.

This script is intended to try to find a time as soon as possible, and if you already have booked a trip abroad or so feel free to limit the search to set a max date that you are interested in a reasonable amount of time before the trip.

> Format: `yyy-mm-dd`

### Offset start

> WARNING! Not properly tested, as it is hard to get same-day bookings.
 
Use the `offsetStart` if you do need a couple of days to be able to plan.
If you set the value to `0` (default) same day bookings are allowed. `1` would mean that you can book 1 day after the execution of the script.

### Persons
Provide `persons` as an list of all the people you want to book a passport for at the same time.
You must define every person in the list with `firstname` and `lastname`. See example above.

### Contact information
You must set the `contact` info of the persons who is doing the booking. You must provide `email` address and `phone` number.  
Note that you will receive booking details both by email and sms.

--- 

## Cron
If you do not want to run this script with the watch-mode on manually you can do a cronjob similar to:
```
*/15 * * * * [PATH_TO_REPO]/src/index.mjs > [PATH_TO_REPO]/result/log.txt 2>&1
```

---

## Development
Documentation below this point is just notes how to help improve this script.

### How to add region support

Add `personDetailsServices` & `serviceGroupIds` to [src/flow/regionSpecifics.mjs](./src/flow/regionSpecifics.mjs) (and make a PR to this repo). Also remembed to update this readme file above.


#### Find personDetailsServices

* Open [https://polisen.se/tjanster-tillstand/pass-och-nationellt-id-kort/boka-tid-hitta-passexpedition/](https://polisen.se/tjanster-tillstand/pass-och-nationellt-id-kort/boka-tid-hitta-passexpedition/)
* Navigate with the link to your region (e.g. [https://bokapass.nemoq.se/Booking/Booking/Index/uppsala](https://bokapass.nemoq.se/Booking/Booking/Index/uppsala))
* Open Networktab in dev tools (`ctrl/cmd`+`shift`+`I`), tick `Preserve Log`.
* (Optional:) Filter for `Doc`.
* Press `Boka ny tid`.
* Select the first `[region]` (post) request (with a 302 Status).
* In the `payload` tab, take note of the `ServiceGroupId` which is the value you need.

#### Find serviceGroupIds
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


