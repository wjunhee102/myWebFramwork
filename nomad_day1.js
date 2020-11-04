// class ObjectUtilities {
//   mergeObjects(objA, objB) {
//     return {
//       ...objA,
//       ...objB
//     };
//   }

//   removePassword(obj) {
//     const newObj = {};

//     Object.entries(obj).forEach(([key, vlaue]) =>
//       key !== "password" ? (newObj[key] = vlaue) : null
//     );

//     return newObj;
//   }

//   freezeObj(cleanUser) {
//     return Object.freeze(cleanUser);
//   }

//   getOnlyValues(frozenUser) {
//     return Object.values(frozenUser);
//   }

//   getOnlyProperties(frozenUser) {
//     return Object.keys(frozenUser);
//   }
// }

// const objA = {
//   name: "Nicolas",
//   favFood: "Kimchi"
// };

// const objB = {
//   password: "12345"
// };

// const newObjectUtilities = new ObjectUtilities();

// const user = newObjectUtilities.mergeObjects(objA, objB);
// console.log(user);

// const cleanUser = newObjectUtilities.removePassword(user);
// console.log(cleanUser);

// const frozenUser = newObjectUtilities.freezeObj(cleanUser);

// const onlyValues = newObjectUtilities.getOnlyValues(frozenUser);
// console.log(onlyValues);

// const onlyProperties = newObjectUtilities.getOnlyProperties(frozenUser);
// console.log(onlyProperties);

// frozenUser.name = "Hello!"; // This should show an error



class ObjectUtilities {
  static mergeObjects = (objectA, objectB) => ({ ...objectA, ...objectB });
  static removePassword = ({ password, ...rest }) => rest;
  static getOnlyProperties = obj => Object.keys(obj);
  static getOnlyValues = obj => Object.values(obj);
  static freezeObj = obj => Object.freeze(obj);
}

const objA = {
  name: "Nicolas",
  favFood: "Kimchi"
};

const objB = {
  password: "12345"
};

const user = ObjectUtilities.mergeObjects(objA, objB);
console.log(user);

const cleanUser = ObjectUtilities.removePassword(user);
console.log(cleanUser);

const frozenUser = ObjectUtilities.freezeObj(cleanUser);

const onlyValues = ObjectUtilities.getOnlyValues(frozenUser);
console.log(onlyValues);

const onlyProperties = ObjectUtilities.getOnlyProperties(frozenUser);
console.log(onlyProperties);

frozenUser.name = "Hello!"; // This should show an error
