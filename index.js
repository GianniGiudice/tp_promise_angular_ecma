import fastify from 'fastify';
// see axios doc on how to use it
import axios from 'axios';

const app = fastify({ logger: true });

app.get('/', async (req, res) => {
  return getData(3, 'FR');
});

// Run the server!
const start = async () => {
  try {
    await app.listen(5000);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

// Get $amount random cat facts
const getCatFacts = (amount) => {
  return new Promise(resolve => {
    axios.get('https://cat-fact.herokuapp.com/facts/random?animal_type=cat&amount=' + amount).then(res => {
      const data = res.data;
      let facts = [];
      for (let i = 0; i < data.length; i++) {
        facts.push(data[i].text);
      }
      resolve(facts);
    }).catch(err => {
      resolve(null);
    })
  });
};

// Get random fox image
const getFoxImage = () => {
  return new Promise(resolve => {
    axios.get('https://randomfox.ca/floof/').then(res => {
      const data = res.data;
      resolve(data.image);
    }).catch(err => {
      resolve(null);
    })
  });
};

// Get $country days off
const getDayOff = (country) => {
  return new Promise(resolve => {
    axios.get('https://date.nager.at/api/v2/PublicHolidays/2021/' + country).then(res => {
      const data = res.data;
      resolve(data);
    }).catch(err => {
      resolve(null);
    })
  });
};

// Get data to return to the API
const getData = () => {
  const cat = getCatFacts(3);
  const fox = getFoxImage();
  const day_off = getDayOff('FR');

  return Promise.all([cat, fox, day_off]).then((values) => {
    let obj = {};

    obj['catFacts'] = values[0];
    obj['foxPicture'] = values[1];
    obj['holidays'] = values[2];
    return obj;
  });
};

start();

