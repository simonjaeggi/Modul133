$(function() {
  //Hide the not needed elements until they are used
  $("#divWoche, #dropdownKlassenauswahl, #divTabelleStundenplan").hide();

  //gets the timestamp and formats it into week-year
  var tagFuerWoche = moment().format('W-Y');;
  if ("LSantiMomentZaehler" in localStorage) {
    var antiMomentZaehler = localStorage.getItem("LSantiMomentZaehler");

  }else{
    var antiMomentZaehler = 0;
  }

  if ("aktuelleWoche" in localStorage) {
    console.log("LocalStorage aktuelleWoche gefüllt");
  }else {
    console.log("LocalStorage aktuelleWoche leer");
    localStorage.setItem("aktuelleWoche", tagFuerWoche);
  }
    $('#labelWoche').html(localStorage.getItem("aktuelleWoche"));
  //check if the profession and the class is saved in the local storage
  if (("gewaehlterBeruf" in localStorage) && ("gewaehlteKlasse" in localStorage)) {
    console.log("LocalStorage gewaehlterBeruf UND gewaehlteKlasse gefüllt");
    $("#divTabelleStundenplan").empty();
    fillDdBerufe();
    fillDdKlassen();
    createAndFillTable();
    $("#dropdownKlassenauswahl").fadeIn(1200);
    $("#divTabelleStundenplan").fadeIn("slow");
    $("#divWoche").fadeIn("slow");

  //check if only the profession is saved in the local storage
  }else if ("gewaehlterBeruf" in localStorage) {
  console.log("LocalStorage gewaehlterBeruf gefüllt");
  fillDdBerufe();
  fillDdKlassen();
  $("#dropdownKlassenauswahl").fadeIn(1200);

  //if nothing is saved in the local storage
  }else {
    console.log("LocalStorage gewaehlterBeruf leer");
    fillDdBerufe();
  }

  //if the dropdown for the professions is used to change its value
  $('#dropdownBerufsgruppe').on('change', function(){
    //make sure there is nothing left from the last time by emptying it
    $("#dropdownKlassenauswahl").empty();
    //make sure there is nothing left from the last time by emptying it
    $("#divTabelleStundenplan").empty();
    //set the local storage with the profession, because it was changend (on change event)
    localStorage.setItem("gewaehlterBeruf", $("#dropdownBerufsgruppe").val());
    //fill the drop down with classes
    fillDdKlassen();
    //hide the dd so the animation of the fading in can appear
    $("#dropdownKlassenauswahl").hide();
    //fade in the dd
    $("#dropdownKlassenauswahl").fadeIn("slow");
  });

  //if the dropdown for the classes is used to change its value
  $('#dropdownKlassenauswahl').on('change', function(){
    //make sure there is nothing left from the last time by emptying it
    $("#divTabelleStundenplan").empty();

    //set the local storage with the class, because it was changend (on change event)
    localStorage.setItem("gewaehlteKlasse", $("#dropdownKlassenauswahl").val());
    //create the table and fill it with data
    createAndFillTable();
    //hide the table so the animation of the fading in can appear
    $("#divTabelleStundenplan").hide();
    //fade in the table
    $("#divTabelleStundenplan").fadeIn("slow");
    //hide the text so the animation of the fading in can appear
    $("#divWoche").hide();
    //fade in the week
    $("#divWoche").fadeIn("slow");
  });

  //onclick button backwards
  $('#buttonZurueck').on('click', function(){
    //make sure there is nothing left from the last time by emptying it
    $("#divTabelleStundenplan").empty();
    //-- so that the counter goes down
    antiMomentZaehler--;
    //substracts 1 Week from the Variable TagfuerWoche and Formats it into W-Y.
    tagFuerWoche = moment().subtract(Math.abs(antiMomentZaehler), 'week').format('W-Y');
    //set the local storage with the week, because it was changend (on click event)
    localStorage.setItem("aktuelleWoche", tagFuerWoche);
    //set the lS to the current count
    localStorage.setItem("LSantiMomentZaehler", antiMomentZaehler);
    //create the table and fill it with data
    createAndFillTable();
    //hide the table so the animation of the fading in can appear
    $("#divTabelleStundenplan").hide();
    //fade in the table
    $("#divTabelleStundenplan").fadeIn("slow");
    //hide the text so the animation of the fading in can appear
    $("#divWoche").hide();
    //fade in the week
    $("#divWoche").fadeIn("slow");
    //set the label of the week to the new value
    $('#labelWoche').html(localStorage.getItem("aktuelleWoche"));

  });

  //onclick button forward
  $('#buttonVorwaerts').on('click', function(){
    //make sure there is nothing left from the last time by emptying it
    $("#divTabelleStundenplan").empty();
    //++ so that the counter goes up
    antiMomentZaehler++;
    //Gets timestamp into var, then adds as many weeks as the count of the Count var goes (to prevent the same date over and over)
    tagFuerWoche = moment().add(antiMomentZaehler,'week').format('W-Y');
    //set the local storage with the week, because it was changend (on click event)
    localStorage.setItem("aktuelleWoche", tagFuerWoche);
    //set the lS to the current count
    localStorage.setItem("LSantiMomentZaehler", antiMomentZaehler);
    //create the table and fill it with data
    createAndFillTable();
    //hide the table so the animation of the fading in can appear
    $("#divTabelleStundenplan").hide();
    //fade in the table
    $("#divTabelleStundenplan").fadeIn("slow");
    //hide the text so the animation of the fading in can appear
    $("#divWoche").hide();
    //fade in the week
    $("#divWoche").fadeIn("slow");
    //set the label of the week to the new value
    $('#labelWoche').html(localStorage.getItem("aktuelleWoche"));

  });


    //function to fill the dropdown Berufe
    function fillDdBerufe(){
        //Json call
        $.getJSON('http://sandbox.gibm.ch/berufe.php')
        //data received
        .done(function(data){
            console.log(".done der JSON Abfrage für die Berufsgruppen gestartet");
            //loop through Json data array
            $.each(data, function(key, value){
              //---------------------
                //value into dropdown

                //checks if the ls is set to the current value. if yes then it fills the dd accordingly
                if (value.beruf_id == localStorage.getItem("gewaehlterBeruf")){
                  $('<option value=' + value.beruf_id + ' selected>' + value.beruf_name +
                  '</option>').appendTo($('#dropdownBerufsgruppe'));
                }
                //if not it fills the dropdown without infuluence of LS
                else{
                  $("#dropdownBerufsgruppe").append('<option value = "' + value.beruf_id + '">' + value.beruf_name + '</option>')
                }
              //---------------------
            });
          })
        // ajax call fail
          .fail(function(){
            console.log("Ajax fillDdBerufe hat nicht funktioniert");
          });
    }
    //function to fill the dropdown Klassen
    function fillDdKlassen(){

      console.log("LocalStorage Beruf: "+localStorage.getItem("gewaehlterBeruf"));
        //Json call
        $.getJSON('http://sandbox.gibm.ch/klassen.php', {beruf_id: localStorage.getItem("gewaehlterBeruf")})
        //data received
          .done(function(data){
            console.log(".done der JSON Abfrage für die Klassen  gestartet");
            $("#dropdownKlassenauswahl").append('<option value = "klasseWaehlen">'+'Bitte Klasse wählen'+'</option>')
            //loop through Json data array
            $.each(data, function(key, value){
              //---------------------
                //value into dropdown
                //checks if the ls is set to the current value. if yes then it fills the dd accordingly
                if (value.klasse_id == localStorage.getItem("gewaehlteKlasse")){
                  $('<option value=' + value.klasse_id + ' selected>' + value.klasse_name +
                  '</option>').appendTo($('#dropdownKlassenauswahl'));
                }
                //if not it fills the dropdown without infuluence of LS

                else{
                  $("#dropdownKlassenauswahl").append('<option value = "' + value.klasse_id + '">' + value.klasse_name + '</option>')
                }
              //---------------------
            });

          })
        // ajax call fail
          .fail(function(){
            console.log("Ajax fillDdKlassen hat nicht funktioniert");

          });
    }
    function createAndFillTable(){
      var tag;
      console.log("LocalStorage Klasse: "+localStorage.getItem("gewaehlteKlasse"));
      console.log("LocalStorage aktuelleWoche: " + localStorage.getItem("aktuelleWoche"));
        $.getJSON("http://sandbox.gibm.ch/tafel.php", {klasse_id: localStorage.getItem("gewaehlteKlasse"), woche: localStorage.getItem("aktuelleWoche")})
        //data received
          .done(function(data){
            console.log(".done der JSON Abfrage für den Stundenplan  gestartet");
            $('#divTabelleStundenplan').append('<table class="table table-striped"><tr><th>Datum</th><th>Wochentag</th><th>Von</th><th>Bis</th><th>Lehrer</th><th>Fach</th><th>Raum</th></tr></table>');

            //loop through Json data array
            $.each(data, function(key, value){
              //Determines what day of the week is put out
                switch (value.tafel_wochentag) {
                case '0':
                  tag = 'Sonntag';
                  break;
                case '1':
                  tag = 'Montag';
                  break;
                case '2':
                  tag = 'Dienstag';
                  break;
                case '3':
                  tag = 'Mittwoch';
                  break;
                case '4':
                  tag = 'Donnerstag';
                  break;
                case '5':
                  tag = 'Freitag';
                  break;
                case '6':
                  tag = 'Samstag';
                  break;

                  default:
                  console.log('Ungültiger Wochentag');
                }
              //---------------------
              // data into table
              $('#divTabelleStundenplan > table').append('<tr><td>' +value.tafel_datum+ '</td><td>' +tag+ '</td><td>' +value.tafel_von+ '</td><td>' +value.tafel_bis+ '</td><td>' +value.tafel_lehrer+ '</td><td>' +value.tafel_longfach+ '</td><td>' +value.tafel_raum+ '</td></tr>')
              //---------------------
            });

          })
        // ajax call fail
          .fail(function(){
            console.log("Ajax createAndFillTable hat nicht funktioniert");
          });


    }
});
