const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');

app.use(cors());
app.use(bodyParser.json());

app.use(cors());

const startServer = async () => {
  const fetch = await import('node-fetch').then((m) => m.default);

  // Pörssisähköhinnan haku
  app.get('/:date%:hour', async (req, res) => {
    const { date, hour } = req.params;

    try {
      const response = await fetch(`${process.env.PRICE_ENDPOINT}?date=${date}&hour=${hour}`);
      const { price } = await response.json();
      res.json({ price });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Error occurred', date, hour }); 
    }
  });

  const port = process.env.PORT || 3001;
  app.listen(port, () => {
    console.log(`Server started on port ${port}`);
  });
};

startServer().catch((error) => console.error('Error starting the server:', error));

const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
const Loading = require('./models/loading')
const Driving = require('./models/driving')
const Setting = require('./models/setting');
require('dotenv').config()

const MONGODB_URI = process.env.MONGODB_URI

console.log('connecting to', MONGODB_URI)

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

// Latauskerran lisäys
app.post('/loadings', (request, response) => {
  const loadingData = request.body;
  
  const loading = new Loading({
    date: loadingData.date,
    hour: loadingData.hour,
    minute: loadingData.minute,
    startingTime: loadingData.startingTime,
    price: loadingData.price,
    kWh: loadingData.kWh,
    meterNum: loadingData.meterNum,
    sntkWh: loadingData.sntkWh,
    fixedPrice: loadingData.fixedPrice,
    totalFixedPrice: loadingData.totalFixedPrice,
    totalKWh: loadingData.totalKWh,
    transportPrice: loadingData.transportPrice,
    totalElectricityPrice: loadingData.totalElectricityPrice,
    totalPrice: loadingData.totalPrice,
  });
  
  loading.save()
    .then(savedLoading => {
      response.status(201).json(savedLoading);
    })
    .catch(error => {
      console.error('Error saving loading:', error);
      response.status(500).json({ error: 'Error occurred' });
    });
});

// Latauskertojen haku
app.get('/loadings', (request, response) => {
  Loading.find()
    .then(loadings => {
      console.log('Loadings retrieved:', loadings);
      response.json(loadings);
    })
    .catch(error => {
      console.error('Error retrieving loadings:', error);
      response.status(500).json({ error: 'Error occurred' });
    });
});

// Latauskerran poisto
app.delete('/loadings/:_id', (request, response) => {
  const { _id } = request.params;

  Loading.findByIdAndDelete(_id)
    .then(deletedLoading => {
      if (deletedLoading) {
        response.json({ message: 'Object deleted successfully' });
      } else {
        response.status(404).json({ error: 'Object not found' });
      }
    })
    .catch(error => {
      console.error('Error deleting loading:', error);
      response.status(500).json({ error: 'Error occurred' });
    });
});

// Kaikkien latauskertojen poisto
app.delete('/loadings', (request, response) => {
  Loading.deleteMany({})
    .then(() => {
      response.json({ message: 'All loadings deleted successfully' });
    })
    .catch(error => {
      console.error('Error deleting loadings:', error);
      response.status(500).json({ error: 'Error occurred' });
    });
});

// Ajokerran lisäys
app.post('/drivings', (request, response) => {
  const drivingData = request.body;
  
  const driving = new Driving({
    date: drivingData.date,
    kilometerNum: drivingData.kilometerNum,
    kilometers: drivingData.kilometers,
    lastKilometer: drivingData.lastKilometer,
    isPrivateDriving: drivingData.isPrivateDriving,
    startingTime: drivingData.startingTime,
    endingTime: drivingData.endingTime,
    route: drivingData.route,
    startingPlace: drivingData.selectedStartingPlace,
    endingPlace: drivingData.selectedEndingPlace,
    driver: drivingData.driver,
    reason: drivingData.reason
  });
  
  driving.save()
    .then(savedDriving => {
      response.status(201).json(savedDriving);
    })
    .catch(error => {
      console.error('Error saving driving:', error);
      response.status(500).json({ error: 'Error occurred' });
    });
});

// Ajokertojen haku
app.get('/drivings', (request, response) => {
  Driving.find()
    .then(drivings => {
      console.log('Drivings retrieved:', drivings);
      response.json(drivings);
    })
    .catch(error => {
      console.error('Error retrieving drivings:', error);
      response.status(500).json({ error: 'Error occurred' });
    });
});

// Ajokerran poisto
app.delete('/drivings/:_id', (request, response) => {
  const { _id } = request.params;

  Driving.findByIdAndDelete(_id)
    .then(deletedDriving => {
      if (deletedDriving) {
        response.json({ message: 'Object deleted successfully' });
      } else {
        response.status(404).json({ error: 'Object not found' });
      }
    })
    .catch(error => {
      console.error('Error deleting driving:', error);
      response.status(500).json({ error: 'Error occurred' });
    });
});

// Kaikkien ajokertojen poisto
app.delete('/drivings', (request, response) => {
  Driving.deleteMany({})
    .then(() => {
      response.json({ message: 'All drivings deleted successfully' });
    })
    .catch(error => {
      console.error('Error deleting drivings:', error);
      response.status(500).json({ error: 'Error occurred' });
    });
});

// Asetusten muokkaus
app.put('/settings/:id', (request, response) => {
  const { id } = request.params;
  const updatedSettingData = request.body;

  Setting.findByIdAndUpdate(
    id,
    updatedSettingData,
    { new: true }
  )
    .then(updatedSetting => {
      if (!updatedSetting) {
        return response.status(404).json({ error: 'Setting not found' });
      }
      response.json(updatedSetting);
    })
    .catch(error => {
      console.error('Error updating setting:', error);
      response.status(500).json({ error: 'Error occurred' });
    });
});

//Asetusten haku
app.get('/settings', (request, response) => {
  Setting.find()
    .then(settings => {
      console.log('Settings retrieved:', settings);
      response.json(settings);
    })
    .catch(error => {
      console.error('Error retrieving settings:', error);
      response.status(500).json({ error: 'Error occurred' });
    });
});

// Viimeisen kilometrilukeman haku
app.get('/drivings', (request, response) => {
  Driving.find()
    .sort({ createdAt: -1 })
    .limit(1)
    .then(drivings => {
      if (drivings.length > 0) {
        const latestDriving = drivings[0];
        const latestKilometerNum = latestDriving.kilometerNum;
      
        response.json({ latestKilometerNum });
      } else {
        response.json({ latestKilometerNum: null });
      }
    })
    .catch(error => {
      console.error('Error retrieving drivings:', error);
      response.status(500).json({ error: 'Error occurred' });
    });
});

// Kilometrilukeman muokkaus
app.put('/settings/:id', (request, response) => {
  const { id } = request.params;
  const { lastKmNum } = request.body;

  Setting.findByIdAndUpdate(
    id,
    { lastKmNum },
    { new: true }
  )
    .then(updatedSetting => {
      if (!updatedSetting) {
        return response.status(404).json({ error: 'Setting not found' });
      }
      response.json(updatedSetting);
    })
    .catch(error => {
      console.error('Error updating setting:', error);
      response.status(500).json({ error: 'Error occurred' });
    });
});