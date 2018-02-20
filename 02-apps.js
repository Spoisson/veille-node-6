const express = require('express');
const app = express();
const fs = require('fs');
app.use(express.static('public'));
/* on associe le moteur de vue au module «ejs» */
const MongoClient = require('mongodb').MongoClient;
const bodyParser= require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs'); // générateur de template



app.get('/membres', (req, res) => {
 
 let cursor = db.collection('adresse')
                .find()
                .toArray(function(err, resultat){
 if (err) return console.log(err)
 	console.log(JSON.stringify(resultat))
 // transfert du contenu vers la vue index.ejs (renders)
 // affiche le contenu de la BD
 res.render('gabarit.ejs', {adresses: resultat})
 }) ;

})
////////////////////////////////////////// Connexion à mongoDB et au serveur Node.js
let db // variable qui contiendra le lien sur la BD

MongoClient.connect('mongodb://127.0.0.1:27017/carnet_adresse', (err, database) => {
 if (err) return console.log(err)
 db = database.db('carnet_adresse')
// lancement du serveur Express sur le port 8081
 app.listen(8081, () => {
 console.log('connexion à la BD et on écoute sur le port 8081')
 })
})

app.get('/list', (req, res) => {
 
 let cursor = db.collection('adresse')
                .find()
                .toArray(function(err, resultat){
 if (err) return console.log(err)
 	console.log(JSON.stringify(resultat))
 // transfert du contenu vers la vue index.ejs (renders)
 // affiche le contenu de la BD
 res.render('adresses.ejs', {adresses: resultat})
 }) ;

})


app.get('/', (req, res) => {
 //res.end('<h1>Accueil</h1>')
 res.render('accueil.ejs');
})


/*
app.get('/', (req, res) => {
 
 let cursor = db.collection('adresse')
                .find().toArray(function(err, resultat){
 if (err) return console.log(err)
 // transfert du contenu vers la vue index.ejs (renders)
 // affiche le contenu de la BD
 res.render('index.ejs', {adresse: resultat})
 }) 
})

*/

app.get('/trier/:cle/:ordre', (req, res) => {

	let cle = req.params.cle
	let ordre = (req.params.ordre == 'asc' ? 1 : -1)
 	let cursor = db.collection('adresse').find().sort(cle, ordre).toArray(function(err, resultat){
 	
 		ordre = (ordre == 1 ? 'desc' : 'asc')
 		//objOrdre[cle] = ordre;
 		res.render('adresses.ejs', {adresses: resultat, cle, ordre})

 	})

 	
})



app.post('/ajouter', (req, res) => {
 db.collection('adresse').save(req.body, (err, result) => {
 if (err) return console.log(err)
 console.log('sauvegarder dans la BD')
 res.redirect('/')
 });

})



app.post('/modifier', (req, res) => {

	console.log('req.body' + req.body['_id'])
	const ObjectID = require('mongodb').ObjectID;

	 if (req.body['_id'] != '')
	 { 
		console.log('sauvegarde') 
		var oModif = {
			 "_id": ObjectID(req.body['_id']), 
			 nom: req.body.nom,
			 prenom:req.body.prenom, 
			 telephone:req.body.telephone
	 	}

		var util = require("util");
		console.log('util = ' + util.inspect(oModif));

	 }
	 else
	 {
		 console.log('insert')
		 console.log(req.body)
		 var oModif = {
			 nom: req.body.nom,
			 prenom:req.body.prenom, 
			 telephone:req.body.telephone
		 }
	 }

		 db.collection('adresse').save(oModif, (err, result) => {
		 if (err) return console.log(err)
		 console.log('sauvegarder dans la BD')
		 res.redirect('/list')

 		})

})


app.get('/detruire/:id', (req, res) => {
 var id = req.params.id
 const ObjectID = require('mongodb').ObjectID;
 console.log(id)
 db.collection('adresse')
 .findOneAndDelete({"_id": ObjectID(req.params.id)}, (err, resultat) => {

if (err) return console.log(err)
 res.redirect('/list')  // redirige vers la route qui affiche la collection
 })

})