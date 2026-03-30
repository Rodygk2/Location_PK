<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; font-size: 13px; color: #1F2937; margin: 40px; }
        h1 { text-align: center; color: #4F46E5; font-size: 22px; margin-bottom: 5px; }
        h2 { font-size: 15px; color: #4F46E5; border-bottom: 2px solid #4F46E5; padding-bottom: 5px; margin-top: 25px; }
        .subtitle { text-align: center; color: #6B7280; margin-bottom: 30px; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 15px 0; }
        .info-item { background: #F8F9FF; padding: 8px 12px; border-radius: 6px; }
        .info-label { color: #6B7280; font-size: 11px; }
        .info-value { font-weight: bold; color: #1F2937; }
        .montant { background: #EEF2FF; padding: 15px; border-radius: 8px; margin: 15px 0; }
        .montant-row { display: flex; justify-content: space-between; margin: 5px 0; }
        .article { margin: 10px 0; line-height: 1.6; }
        .signatures { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-top: 40px; }
        .signature-box { border: 1px solid #E5E7EB; border-radius: 8px; padding: 15px; text-align: center; }
        .signature-img { max-width: 200px; max-height: 80px; margin: 10px auto; display: block; }
        .footer { text-align: center; color: #9CA3AF; font-size: 11px; margin-top: 40px; border-top: 1px solid #E5E7EB; padding-top: 15px; }
        table { width: 100%; border-collapse: collapse; margin: 15px 0; }
        th { background: #4F46E5; color: white; padding: 8px; text-align: left; }
        td { padding: 8px; border-bottom: 1px solid #E5E7EB; }
    </style>
</head>
<body>

    <h1>🏠 ChambreParakou</h1>
    <p class="subtitle">CONTRAT DE LOCATION</p>
    <p class="subtitle">N° {{ str_pad($contrat->id, 6, '0', STR_PAD_LEFT) }} — Généré le {{ now()->format('d/m/Y') }}</p>

    <h2>1. Parties du contrat</h2>
    <table>
        <tr>
            <th>Rôle</th>
            <th>Nom complet</th>
            <th>Téléphone</th>
            <th>Email</th>
        </tr>
        <tr>
            <td>Propriétaire</td>
            <td>{{ $contrat->proprietaire->prenom }} {{ $contrat->proprietaire->nom }}</td>
            <td>{{ $contrat->proprietaire->telephone }}</td>
            <td>{{ $contrat->proprietaire->email }}</td>
        </tr>
        <tr>
            <td>Locataire</td>
            <td>{{ $contrat->locataire->prenom }} {{ $contrat->locataire->nom }}</td>
            <td>{{ $contrat->locataire->telephone }}</td>
            <td>{{ $contrat->locataire->email }}</td>
        </tr>
    </table>

    <h2>2. Bien loué</h2>
    <table>
        <tr><th>Désignation</th><th>Détail</th></tr>
        <tr><td>Titre</td><td>{{ $contrat->annonce->titre }}</td></tr>
        <tr><td>Type</td><td>{{ str_replace('_', ' ', $contrat->annonce->type_chambre) }}</td></tr>
        <tr><td>Quartier</td><td>{{ $contrat->annonce->quartier }}, Parakou</td></tr>
        <tr><td>Meublée</td><td>{{ $contrat->annonce->meublee ? 'Oui' : 'Non' }}</td></tr>
        <tr><td>Eau incluse</td><td>{{ $contrat->annonce->eau_incluse ? 'Oui' : 'Non' }}</td></tr>
        <tr><td>Électricité incluse</td><td>{{ $contrat->annonce->electricite_incluse ? 'Oui' : 'Non' }}</td></tr>
    </table>

    <h2>3. Conditions financières</h2>
    <div class="montant">
        <div class="montant-row">
            <span>Loyer mensuel</span>
            <strong>{{ number_format($contrat->loyer, 0, ',', ' ') }} FCFA</strong>
        </div>
        <div class="montant-row">
            <span>Caution (3 mois)</span>
            <strong>{{ number_format($contrat->caution, 0, ',', ' ') }} FCFA</strong>
        </div>
        <div class="montant-row">
            <span>Durée du contrat</span>
            <strong>{{ $contrat->duree }}</strong>
        </div>
        <div class="montant-row">
            <span>Date de début</span>
            <strong>{{ \Carbon\Carbon::parse($contrat->date_debut)->format('d/m/Y') }}</strong>
        </div>
    </div>

    <h2>4. Clauses du contrat</h2>
    <div class="article">
        <strong>Article 1 — Objet :</strong> Le présent contrat a pour objet la location du logement désigné ci-dessus, à usage d'habitation exclusivement.
    </div>
    <div class="article">
        <strong>Article 2 — Durée :</strong> Le contrat est conclu pour une durée de {{ $contrat->duree }}, à compter du {{ \Carbon\Carbon::parse($contrat->date_debut)->format('d/m/Y') }}.
    </div>
    <div class="article">
        <strong>Article 3 — Loyer :</strong> Le loyer mensuel est fixé à {{ number_format($contrat->loyer, 0, ',', ' ') }} FCFA, payable le 1er de chaque mois.
    </div>
    <div class="article">
        <strong>Article 4 — Caution :</strong> Une caution de {{ number_format($contrat->caution, 0, ',', ' ') }} FCFA (équivalent à 3 mois de loyer) est versée par le locataire. Elle sera restituée à la fin du bail, déduction faite des éventuelles dégradations.
    </div>
    <div class="article">
        <strong>Article 5 — Obligations du locataire :</strong> Le locataire s'engage à payer le loyer aux échéances convenues, à entretenir le logement en bon état, et à ne pas sous-louer sans accord écrit du propriétaire.
    </div>
    <div class="article">
        <strong>Article 6 — Résiliation :</strong> Chaque partie peut résilier le contrat avec un préavis d'un mois, notifié par écrit.
    </div>

    <h2>5. Signatures électroniques</h2>
    <div class="signatures">
        <div class="signature-box">
            <p><strong>Locataire</strong></p>
            <p>{{ $contrat->locataire->prenom }} {{ $contrat->locataire->nom }}</p>
            @if($contrat->signature_locataire)
                <img src="{{ $contrat->signature_locataire }}" class="signature-img" alt="Signature locataire" />
                <p style="color: #10B981; font-size: 11px;">✅ Signé le {{ $contrat->signe_locataire_le?->format('d/m/Y à H:i') }}</p>
            @else
                <p style="color: #EF4444; font-size: 11px;">❌ En attente de signature</p>
            @endif
        </div>
        <div class="signature-box">
            <p><strong>Propriétaire</strong></p>
            <p>{{ $contrat->proprietaire->prenom }} {{ $contrat->proprietaire->nom }}</p>
            @if($contrat->signature_proprietaire)
                <img src="{{ $contrat->signature_proprietaire }}" class="signature-img" alt="Signature propriétaire" />
                <p style="color: #10B981; font-size: 11px;">✅ Signé le {{ $contrat->signe_proprietaire_le?->format('d/m/Y à H:i') }}</p>
            @else
                <p style="color: #EF4444; font-size: 11px;">❌ En attente de signature</p>
            @endif
        </div>
    </div>

    <div class="footer">
        ChambreParakou — Plateforme de location à Parakou, Bénin<br>
        Document généré électroniquement — Valeur juridique reconnue
    </div>

</body>
</html>