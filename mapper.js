const Dictionary = require('./dict/localDict.json');
const BIKdictionary = require('./dict/bic.json');

//dictionary helper

//поиск значений справочных записей

class MapperDict {
   detectDictionaryRecord = (uid) => {
     let dict = null;
     let idx = -1;
     let value = null;

     for (let key in Dictionary) {
       if (Dictionary[key].findIndex(el => el.id === uid) !== -1) {
         idx = Dictionary[key].findIndex(el => el.id === uid);
         dict = key;
         value = Dictionary[key][idx].xpath;
       }
     }

     return [idx, dict, value];
   };

   detectBicDictionaryRecord = (uid) => {
     let bic = null;
     let idx = -1;
     let value = null;

     for (let key in BIKdictionary) {
       if (BIKdictionary[key].findIndex(el => el.id === uid) !== -1) {
         idx = BIKdictionary[key].findIndex(el => el.id === uid);
         bic = BIKdictionary[key][idx].bic;
         value = BIKdictionary[key][idx].xpath;
       }
     }

     return [idx, bic, value];
   };
}

class MapperDictOpt {
  constructor() {
    this.cache = new Map();
  }

   detectDictionaryRecord = async (uid, dictionary = Dictionary) => {
     const cachedResult = this.cache.get(uid);
     if (cachedResult) {return cachedResult;}

     const result = await this.searchRecord(uid, dictionary);
     this.cache.set(uid, result);
     return result;
   };

   searchRecord = async (uid, dictionary) => {
     try {
       for (const key of Object.keys(dictionary)) {
         const item = dictionary[key].find(el => el.id === uid);
         if (item) {
           return {
             index: dictionary[key].indexOf(item),
             dict: key,
             value: item.xpath,
             bic: item.bic || null,
           };
         }
       }
       return null;
     } catch (error) {
       console.error('Ошибка при поиске записи:', error);
       return null;
     }
   }
}

exports.MapperDict = MapperDict;
