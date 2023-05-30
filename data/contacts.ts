
import { v4 as uuidv4 } from 'uuid';

export const contacts = [
{

  id: uuidv4(),
  firstName: "Sebastian",
  lastName: "Perez",
  documentType: "DNI",
  documentNumber: 22669584,
  age: 18,
  email: "Sebastian@hotmail.com",
  phone: {
    create: [
      {
        id: uuidv4(),
        type: "fijo",
        numberPhone: "4-665-5995",
      }
    ]
  },
  address: {
    create: [
      {
        id: uuidv4(),
        locality: "San Miguel",
        street: "Av. Rivadavia",
        numberStreet: 145,
        description: "" ,
      }
    ]
  }
},
{
  firstName: "Pablo",
  lastName: "Gerez",
  documentType: "DNI",
  documentNumber: 34584695,
  age: 21,
  email: "Pablo@gmail.com",
  phone: {    
    create: [
      {
        type: "celular",
        numberPhone: "11-4665-4851",
      }
    ]
  },
  address: {    
    create: [
      {
        locality: "Bella Vista",
        street: "Catamarca",
        numberStreet: 1448,
        description: "" 
      }
    ]
  }
},
{
  firstName: "Ricardo",
  lastName: "Gutierrez",
  documentType: "DNI",
  documentNumber: 28956234,
  age: 22,
  email: "Ricardo@hotmail.com",
  phone: {    
    create: [
      {
         type: "fijo",
         numberPhone: "4-666-4862",
      }
    ]
  },
  address:  {    
    create: [
      {
          locality: "Banfield",
          street: "Cerro Colorado",
          numberStreet: 1558,
          description: "" 
        }
    ]
  }
},
{
  firstName: "Mariana",
  lastName: "Gomez",
  documentType: "DNI",
  documentNumber: 26369258,
  age: 26,
  email: "Mariana@gmail.com",
  phone:  {    
    create: [
      {
        type: "celular",
        numberPhone: "4-665-5995",
      },
      {
        type: "fijo",
        numberPhone: "4-486-4848",
      },
    ],
  },
  address:   {    
    create: [
      {
        locality: "Moron",
        street: "Av San Martin",
        numberStreet: 2622,
        description: "" 
      }
    ]
  },
},
{
 firstName: "Tatiana",
 lastName: "Rulh",
 documentType: "DNI",
 documentNumber: 35159235,
 age: 35,
 email: "Tatiana@hotmail.com",
 phone: {    
  create: [
    {
         type: "celular",
         numberPhone: "11-1425-5995",
        }
      ]
},
address:  {    
  create: [
    {
      locality: "San Miguel",
      street: "Av. Rivadavia",
      numberStreet: 145,
      description: "" 
    },
    {
      locality: "CABA",
      street: "Maipu",
      numberStreet: 5962,
      description: "" 
    },
  ]
}
}
]