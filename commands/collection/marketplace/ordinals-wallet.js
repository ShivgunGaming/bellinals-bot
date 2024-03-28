const axios = require('axios').default

const getTotalNumbers = async (collectionSymbol) => {
  const res = await axios.get(`https://turbo.ordinalswallet.com/collection/${collectionSymbol}/stats`)
  return res.data.total_supply
}

const getInsInfos = async (collectionId, PAGINATED_AMOUNT, offset, collectionSymbol) => {
  const paginatedInscriptions = []
  const { data } = await axios.get(
    `https://bellsturbo.ordinalswallet.com/collection/hells-bells/inscriptions?limit=1250&offset=${offset}&order=PriceAsc&listed=false`
  )
  data.forEach((inscription) => {
    paginatedInscriptions.push({ collectionId, inscriptionRef: inscription.id })
  })
  return { paginatedInscriptions, count: PAGINATED_AMOUNT }
}

module.exports = {
  name: 'Ordinals Wallet',
  getTotalNumbers,
  getInsInfos,
}
