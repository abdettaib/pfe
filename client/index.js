import Web3 from 'web3';
import authentification from '../build/contracts/authentification.json';


let web3;
let Authentification;
var randomstring = require("randomstring");
////////////////////////////////////////////////////////////////////
//////////////////////////initiation web3-metamask-//////////////////////////

const initWeb3 = () => {
  return new Promise((resolve, reject) => {
    if(typeof window.ethereum !== 'undefined') {
      const web3 = new Web3(window.ethereum);
      window.ethereum.enable()
        .then(() => {
          resolve(
            new Web3(window.ethereum)
          );
        })
        .catch(e => {
          reject(e);
        });
      return;
    }
    if(typeof window.web3 !== 'undefined') {
      return resolve(
        new Web3(window.web3.currentProvider)
      );
    }
    resolve(new Web3('http://localhost:9545'));
  });
};

/////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////:initiation contrat//////////////////////////////////////
const initContract = () => {
  const deploymentKey = Object.keys(authentification.networks)[0];
  return new web3.eth.Contract(
    authentification.abi, 
    authentification
      .networks[deploymentKey]
      .address
  );
};

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////initiation de l'application///////////////////////////////////////




const initApp = async  () => {


  const $data = document.getElementById('data');

  let  accounts = await web3.eth.getAccounts();

   const $ajouter = document.getElementById('addData');

  const $modifier = document.getElementById('chData');

  const $supprimer = document.getElementById('deleteData');

  

  $ajouter.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data1 = e.target.elements[0].value;

    let choix = [];
    for (let i = 1; i < 4; i ++){
      if (e.target.elements[i].checked){
        //alert('valeur ' + formulaire.elements['check[]'][i].value + ' cochée');
  choix.push(e.target.elements[i].value) ;}
      }

      const data2 = choix;
    //const data2 = [e.target.elements[1].cheked.value,e.target.cheked.elements[2].value,e.target.elements[3].cheked.value]
    await Authentification.methods
      .ajouterUtilisateur(data1,data2)
      .send({from: accounts[0]})
      .then(result => 
       { $data.innerHTML = (result.events.retour.returnValues.value+ " \""+data1+"\"" );
      });
      $ajouter.reset();
  });


  $modifier.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data1 = e.target.elements[0].value;
    const data2 = [e.target.elements[1].value,e.target.elements[2].value,e.target.elements[3].value]
    await Authentification.methods
      .modifierUtilisateur(data1,data2)
      .send({from: accounts[0]})
      .then(result => 
       { $data.innerHTML = (result.events.retour.returnValues.value+ " \""+data1+"\"" );
      });
      $modifier.reset();
  });



  $supprimer.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data1 = e.target.elements[0].value;
    await Authentification.methods
      .supprimerUtilisateur(data1)
      .send({from: accounts[0]})
      .then(result => {
        $data.innerHTML = (result.events.retour.returnValues.value+ " \""+data1+"\" ");
      });
      $supprimer.reset();
      

  });


};


document.addEventListener('DOMContentLoaded', () => {
  initWeb3()
    .then(_web3 => {
      web3 = _web3;
      Authentification = initContract();
    
      initApp(); 
    })
    .catch(e => console.log(e.message));
});