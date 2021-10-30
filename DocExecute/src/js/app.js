App = {
  web3Provider: null,
  contracts: {},

  init: function() {

    $.getJSON('../restate.json', function(data) {
      var restateRow = $('#restateRow');
      var reFrame = $('#reFrame');

      for (i = 0; i < data.length; i ++) {
        reFrame.find('.panel-title').text(data[i].name);
        reFrame.find('img').attr('src', data[i].picture);
        reFrame.find('.re-address').text(data[i].address);
        reFrame.find('.plotNo').text(data[i].plotNo);
        reFrame.find('.re-location').text(data[i].location);
        reFrame.find('.btn-docexecute').attr('data-id', data[i].id);

        restateRow.append(reFrame.html());
      }
    });

    return App.initWeb3();
  },

  initWeb3: function() {
    
    if(typeof web3 !== 'undefined') {

      App.web3Provider = web3.currentProvider;

    } 
    else {
      
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');

    }

    web3 = new Web3(App.web3Provider);

    return App.initContract();
  },

  initContract: function() {
    $.getJSON('Purchasedocexs.json', function(data) {

      var PurchasedocexsArtifact = data;

      App.contracts.Purchasedocexs = TruffleContract(PurchasedocexsArtifact);

      // Set provider for contract
      App.contracts.Purchasedocexs.setProvider(App.web3Provider);

      // Use contract to mark  executePurchase

      return App.markPurchased();

      })

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-docexecute', App.executePurchase);
  },

  // Function to mark already  executePurchase
  markPurchased: function(purchaserdocex, account) {
    var PurchasedocexsInstance;

    // Call a promise if deployed
    App.contracts.Purchasedocexs.deployed().then(function(instance) {
      PurchasedocexsInstance = instance;

      // Retrieve array of purchaserdocex from blockchain
      // call() reads data from blockchain without spending ether
      return PurchasedocexsInstance.getPurchasers.call();

    }).then(function(purchaserdocex) {
      // If retrieved
      // Check for adopted and mark them
      for(i = 0; i < purchaserdocex.length; i++) {

        if (purchaserdocex[i] !== '0x0000000000000000000000000000000000000000') 
        {
          $('.panel-reId').eq(i).find('button').text('Success').attr('disabled', true);
        }
      }
    }).catch(function(err) {
      // Log error message in case function fails
      console.log(err.message);      
    })
  },

  executePurchase: function(event) {
    event.preventDefault();
    
    // event.target gives clicked element
    // 'id' data is retrieved from element
    var PurchasedocexsInstance;

    var reId = parseInt($(event.target).data('id'));    

    web3.eth.getAccounts(function(err, accounts) {
      if(err) 
      {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.Purchasedocexs.deployed().then(function(instance)
       {

        PurchasedocexsInstance = instance;

        // Execute adopt as a transaction by sending account
        return PurchasedocexsInstance.purchase(reId, {from: account});
      }).then(function(res) {
          // If transaction successful, again mark purchaseed
          return App.markPurchased();
        }).catch(function(err) {
          console.log(err.message);
        })
      });
    
  }

};

// Initialize app when window loaded
$(function() {
  $(window).load(function() {
    App.init();
  });
});
