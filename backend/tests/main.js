const axios = require('axios');
const { expect } = require('chai');

//API URL + Pokémon name to add to the path. The Pokémon name being separated allows us to make additional checks
const apiPath = 'https://pokeapi.co/api/v2/pokemon/';
const pokemon = 'pikachu';

//Expected variables. Types are stored as an array since most Pokémon have 2 types
const expectedStatus = 'OK';
const expectedMoves = 105;
const expectedTypes = ['electric'];
//Expected types as a set. Explained within Test 3
//const expectedTypes = new Set(['electric']);

let apiData;

describe('backend scenario', async function () {

    it('Test 1: Get API Data', async () => {

        //Get the data and store it for the rest of the tests
        await axios.get(apiPath+pokemon).then(function (response) {

            apiData = response;

            //Check that the data was retrieved successfully and that it corresponds with the desired Pokémon
            expect(apiData.statusText).to.equal(expectedStatus);
            expect(apiData.data['name']).to.equal(pokemon);

        });

    });

    it('Test 2: Check Moves', async () => {

        //Check that the amount of moves the Pokémon learns according to the API is what we expect
        expect(apiData.data['moves'].length).to.equal(expectedMoves);

    });

    it('Test 3: Check Type', async () => {

        //Check that, according to the API, the Pokémon has the same amount of types as we expect
        expect(apiData.data['types'].length).to.equal(expectedTypes.length);

        //Iterate through the types to check that hey are what we expected
        for(let i = 0; i < apiData.data['types'].length; i++){

            expect(apiData.data['types'][i]['type']['name']).to.equal(expectedTypes[i]);

        }

        //NERD EXTRA: Pokémon with the two same types in different order are functionally the same game-mechanics wise.
        //The API should have them in the correct order, so the first loop would be ideal since it would also check that the types are ordered.
        //However, if the order is no concern, we could also use this loop which does not take it into account.
        //If identifying unordered typings as equal is needed, the container for expectedTypes could be changed to a set to avoid repeating types.
        //Set container is not compatible with the first loop as implemented, but it would require errors on both the API and expected values to give a false positive.
        for(let i = 0; i < apiData.data['types'].length; i++){

            expect(expectedTypes.includes(apiData.data['types'][i]['type']['name'])).to.be.true;

            //Method is slightly different if set is used
            //expect(expectedTypes.has(apiData.data['types'][i]['type']['name'])).to.be.true;
        }

    });

});