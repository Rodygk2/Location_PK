<?php

namespace App\Http\Requests\Auth;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
{
    // Tout le monde peut faire une demande d'inscription
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nom'       => ['required', 'string', 'max:100'],
            'prenom'    => ['required', 'string', 'max:100'],
            'email'     => ['required', 'email', 'unique:users,email'],
            'telephone' => ['required', 'string', 'max:20', 'unique:users,telephone'],
            'password'  => ['required', 'string', 'min:8', 'confirmed'], // ← 'confirmed' vérifie password_confirmation
            'role'      => ['required', 'in:locataire,proprietaire'],
        ];
    }

    // Messages d'erreur en français
    public function messages(): array
    {
        return [
            'nom.required'           => 'Le nom est obligatoire.',
            'prenom.required'        => 'Le prénom est obligatoire.',
            'email.required'         => 'L\'email est obligatoire.',
            'email.unique'           => 'Cet email est déjà utilisé.',
            'telephone.unique'       => 'Ce numéro de téléphone est déjà utilisé.',
            'password.min'           => 'Le mot de passe doit contenir au moins 8 caractères.',
            'password.confirmed'     => 'Les mots de passe ne correspondent pas.',
            'role.in'                => 'Le rôle doit être locataire ou proprietaire.',
        ];
    }
}
