# weroad_be_test_vignoli

## Project setup

Clonare il repository
`git clone  https://github.com/DamienPirsy/wetravel_be_test_vignoli.git`

## BACKEND:



```bash
cd be

// copiare env
$ cp env.dist .env

$ npm i

// verificare i valori del file di evn
$ vi .env

// fare la build del container
$ docker compose build
$ make run

//entrare nel container
$ docker exec -ti weroad-travel-vignoli

// INit schema prisma
$ app/ prisma init

// migrations:
$ app/ npx prisma migrate dev --name init

// Seeding iniziale
$ app/ npm run seed

```

Test:

```
$ make test-unit
```


## FRONTEND

**Attenzione** : Il frontend non è completo ma ci sono solo gli step di elenco pacchetti e dettagli pacchetto.

```
$ npm i
$ npm run serve
// verificare che l'url sia lo stesso nel parametro FE_URL in `be/.env`
```


## NOTE

In allegato anche rappresentazione del macro flusso e schema Graphql generato (che è lo stesso del file autogenerato in be/src/schema.gql)


User journey:

1) L'utente visualizza l'elenco dei pacchetti disponibili (getAllPackages).
2) Quando viene selezionato un pacchetto viene presentato il dettaglio (getPackageById)
3) Per aggiungere al carrello (addToCart) bisogna fornire id pacchetto (packId), numero di posti acquistati (seats) ed email
   - Se un utente non è presente con quella mail nella tabella User, verrà creato, altrimenti viene restituito lo `userId` corrispondente.
   - Quando un carrello viene creato il numero di `seats` viene scalato da quelli presenti nel pacchetto.
   - Se viene richiesto un numero di posti maggiorni di quelli disponibili viene restituito errore
   - Se viene passato 0 come numero di posti è equivalente a cancellare il carrello, ed i posti presenti vengono rialloacti al pacchetto
   - Se il carrello è scaduto i posti vengono riallocati; l'utente può ricreare il carrello.
   - Ogni utente ha UN solo carrelo (univoco su `userId`)
4) Quando viene creato l'ordine (createOrder) si genera un nuovo record nella tabella Orders con status PENDING
5) Qui immaginavo lo step di pagamento, che invia poi una mutation di OrderUpdate con cambio di stato a PAID

Le modifiche al carrello e all'ordine generano degli eventi interni che possono essere intercettti per ulteriori operazioni, ad esempio mandare una email con ORDER_UPDATED, oppure la gestione dei posti disponibili nel modulo Package è fatta usando gli eventi di CART_UPDATED e CART_CREATED.

