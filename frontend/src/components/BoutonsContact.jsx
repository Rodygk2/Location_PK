function BoutonsContact({ nom, prenom, telephone, message = '' }) {

    // Nettoyer le numéro — garder seulement les chiffres
    const tel = telephone?.replace(/[^0-9]/g, '')

    // Message WhatsApp pré-rempli
    const messageWhatsApp = encodeURIComponent(
        message || `Bonjour ${prenom} ${nom}, je vous contacte via ChambreParakou.`
    )

    return (
        <div className="flex gap-3 flex-wrap">

            {/* Bouton Appel */}

            <a href={`tel:+229${tel}`}
                className="flex items-center gap-2 bg-green-50 text-green-600 hover:bg-green-100 px-4 py-2 rounded-xl text-sm font-medium transition">
                📞 Appeler
            </a>

      {/* Bouton WhatsApp */ }

    <a href = {`https://wa.me/229${tel}?text=${messageWhatsApp}`}
        target = "_blank"
        rel = "noreferrer"
        className = "flex items-center gap-2 bg-emerald-500 text-white hover:bg-emerald-600 px-4 py-2 rounded-xl text-sm font-medium transition">
         WhatsApp
    </a >

    </div >
  )
}

export default BoutonsContact