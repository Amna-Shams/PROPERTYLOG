export interface AreaData {
  name: string;
  postalCode: string;
}

export interface CityData {
  name: string;
  areas: AreaData[];
}

export interface ProvinceData {
  name: string;
  cities: CityData[];
}

export const PAKISTAN_LOCATION_DATA: ProvinceData[] = [
  {
    name: "Punjab",
    cities: [
      {
        name: "Lahore",
        areas: [
          { name: "DHA Phase 1-8", postalCode: "54000" },
          { name: "Gulberg I-V", postalCode: "54660" },
          { name: "Bahria Town", postalCode: "53720" },
          { name: "Johar Town", postalCode: "54770" },
          { name: "Model Town", postalCode: "54700" },
          { name: "Cantt", postalCode: "54810" },
          { name: "Wapda Town", postalCode: "54782" },
          { name: "Valencia Town", postalCode: "54771" }
        ]
      },
      {
        name: "Rawalpindi",
        areas: [
          { name: "Bahria Town", postalCode: "46000" },
          { name: "DHA Phase 1-4", postalCode: "46100" },
          { name: "Satellite Town", postalCode: "46300" },
          { name: "Chaklala Scheme", postalCode: "46200" },
          { name: "Saddar", postalCode: "46000" },
          { name: "Westridge", postalCode: "46060" }
        ]
      },
      {
        name: "Faisalabad",
        areas: [
          { name: "Peoples Colony", postalCode: "38000" },
          { name: "Madina Town", postalCode: "38010" },
          { name: "D Ground", postalCode: "38000" },
          { name: "Kohinoor City", postalCode: "38040" },
          { name: "Canal Road", postalCode: "38020" }
        ]
      },
      {
        name: "Multan",
        areas: [
          { name: "Bosan Road", postalCode: "60000" },
          { name: "Gulgasht Colony", postalCode: "60700" },
          { name: "Multan Cantt", postalCode: "60000" },
          { name: "Officers Colony", postalCode: "60600" },
          { name: "Shah Rukn-e-Alam", postalCode: "60010" }
        ]
      }
    ]
  },
  {
    name: "Sindh",
    cities: [
      {
        name: "Karachi",
        areas: [
          { name: "DHA Phase 1-8", postalCode: "75500" },
          { name: "Clifton", postalCode: "75600" },
          { name: "Gulshan-e-Iqbal", postalCode: "75300" },
          { name: "Gulistan-e-Jauhar", postalCode: "75210" },
          { name: "North Nazimabad", postalCode: "74700" },
          { name: "PECHS", postalCode: "75400" },
          { name: "Korangi", postalCode: "74900" },
          { name: "Saddar", postalCode: "74400" }
        ]
      },
      {
        name: "Hyderabad",
        areas: [
          { name: "Latifabad", postalCode: "71000" },
          { name: "Qasimabad", postalCode: "71000" },
          { name: "Saddar", postalCode: "71800" },
          { name: "Cantt", postalCode: "71000" }
        ]
      }
    ]
  },
  {
    name: "Khyber Pakhtunkhwa",
    cities: [
      {
        name: "Peshawar",
        areas: [
          { name: "Hayatabad", postalCode: "25000" },
          { name: "University Town", postalCode: "25000" },
          { name: "Peshawar Cantt", postalCode: "25000" },
          { name: "Gulbahar", postalCode: "25000" },
          { name: "Warsak Road", postalCode: "25120" }
        ]
      },
      {
        name: "Abbottabad",
        areas: [
          { name: "Mandian", postalCode: "22010" },
          { name: "Jinnahabad", postalCode: "22010" },
          { name: "Cantt", postalCode: "22010" }
        ]
      }
    ]
  },
  {
    name: "Balochistan",
    cities: [
      {
        name: "Quetta",
        areas: [
          { name: "Jinnah Town", postalCode: "87300" },
          { name: "Satellite Town", postalCode: "87300" },
          { name: "Quetta Cantt", postalCode: "87300" },
          { name: "Airport Road", postalCode: "87300" }
        ]
      }
    ]
  },
  {
    name: "Islamabad Capital Territory",
    cities: [
      {
        name: "Islamabad",
        areas: [
          { name: "Sector F-6 & F-7", postalCode: "44000" },
          { name: "Sector F-10 & F-11", postalCode: "44000" },
          { name: "Sector G-11 & G-13", postalCode: "44000" },
          { name: "DHA Phase 1-5", postalCode: "44000" },
          { name: "Bahria Town", postalCode: "45710" },
          { name: "Sector E-11", postalCode: "44000" },
          { name: "Sector I-8", postalCode: "44000" }
        ]
      }
    ]
  },
  {
    name: "Azad Jammu & Kashmir",
    cities: [
      {
        name: "Mirpur",
        areas: [
          { name: "Sector F-1", postalCode: "10250" },
          { name: "Sector C-3", postalCode: "10250" },
          { name: "New City", postalCode: "10250" }
        ]
      },
      {
        name: "Muzaffarabad",
        areas: [
          { name: "Main Bazaar", postalCode: "13100" },
          { name: "Upper Chatter", postalCode: "13100" }
        ]
      }
    ]
  },
  {
    name: "Gilgit-Baltistan",
    cities: [
      {
        name: "Gilgit",
        areas: [
          { name: "Jutial", postalCode: "15100" },
          { name: "Chinar Bagh", postalCode: "15100" }
        ]
      }
    ]
  }
];
