<?php
// app/Http/Requests/Annonce/StoreAnnonceRequest.php

namespace App\Http\Requests\Annonce;

use Illuminate\Foundation\Http\FormRequest;

class StoreAnnonceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Le middleware s'occupe déjà du contrôle d'accès
    }

    public function rules(): array
    {
        return [
            'titre'                => ['required', 'string', 'max:200'],
            'description'          => ['required', 'string', 'min:50'],
            'prix'                 => ['required', 'numeric', 'min:1000'],
            'periodicite'          => ['required', 'in:mensuel,annuel'],
            'quartier'             => ['required', 'string', 'max:100'],
            'ville'                => ['required', 'string', 'max:100'],
            'type_chambre'         => ['required', 'in:chambre_simple,chambre_salon,appartement,studio'],
            'nombre_pieces'        => ['required', 'integer', 'min:1'],
            'meublee'              => ['boolean'],
            'eau_incluse'          => ['boolean'],
            'electricite_incluse'  => ['boolean'],

            // Localisation
            'latitude'             => ['required', 'numeric'],
            'longitude'            => ['required', 'numeric'],
            'adresse_complete'     => ['nullable', 'string'],

            // Photos
            'photos'               => ['required', 'array', 'min:1', 'max:5'],
            'photos.*'             => ['image', 'mimes:jpeg,png,jpg,webp', 'max:2048'], // 2MB max
        ];
    }

    public function messages(): array
    {
        return [
            'titre.required'          => 'Le titre est obligatoire.',
            'description.min'         => 'La description doit contenir au moins 50 caractères.',
            'prix.min'                => 'Le prix minimum est de 1000 FCFA.',
            'type_chambre.in'         => 'Le type de chambre n\'est pas valide.',
            'photos.required'         => 'Au moins une photo est obligatoire.',
            'photos.max'              => '5 photos maximum sont autorisées.',
            'photos.*.image'          => 'Les fichiers doivent être des images.',
            'photos.*.max'            => 'Chaque photo ne doit pas dépasser 2MB.',
        ];
    }
}