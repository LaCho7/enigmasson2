# Machine Enigma - Implementation Numerique

## Description

Cette application est une implémentation numérique fidèle de la machine Enigma, célèbre machine de chiffrement utilisée lors de la Seconde Guerre mondiale. Le projet propose une interface interactive permettant de comprendre les principes fondamentaux du chiffrement par substitution polyalphabétique.

## Fonctionnalités

### Composants Principaux

**Rotors** : Trois rotors rotatifs configurables (positions 0-25) qui avancent automatiquement à chaque caractère encrypté. Chaque rotor possède un mécanisme d'encliquetage (notch) déclenchant l'avance du rotor suivant.

**Tableau de connexions** : Système de permutation permettant d'interconnecter jusqu'à 3 paires de lettres. Ces connexions sont appliquées avant et après le passage dans les rotors.

**Reflecteur** : Composant qui renvoie le signal au travers des rotors en sens inverse, assurant la propriété fondamentale d'Enigma : le chiffrement est réversible.

**Clavier virtuel** : Interface permettant de saisir du texte lettre par lettre, chaque frappe déclenchant le mécanisme d'avance des rotors.

### Proprietes Cryptographiques

La machine Enigma possède une propriété unique : si l'on chiffre un texte chiffré avec les mêmes paramètres initiaux (positions des rotors et tableau de connexions identiques), on récupère le texte original. Cela rend l'algorithme intrinsèquement symétrique.

## Utilisation

1. Configurer les trois rotors en définissant leur position initiale (0-25, correspondant aux lettres A-Z)
2. Paramétrer le tableau de connexions en établissant jusqu'à 3 paires d'échange
3. Utiliser le clavier virtuel pour saisir le message à chiffrer
4. Observer l'avance automatique des rotors après chaque caractère
5. Cliquer sur le bouton "DECODER" pour retrouver le message original

## Installation et Lancement

### Prérequis
- Node.js (version 14 ou supérieure)
- npm

### Instructions (Windows PowerShell)

```powershell
cd "c:\Données\_2025_2026\enigmacopilot"
npm install
npm run dev
```

L'application sera accessible à l'adresse http://localhost:3000

## Architecture Technique

**Framework** : Next.js 13 avec React 18

**Langage** : TypeScript

**Style** : CSS personnalisé avec design responsive

### Structure des fichiers

- `pages/index.tsx` : Interface utilisateur principale
- `pages/_app.tsx` : Configuration globale de l'application
- `lib/enigma.ts` : Implementation de la logique Enigma (rotors, reflecteur, permutations)
- `components/Keyboard.tsx` : Composant du clavier virtuel
- `styles/globals.css` : Feuille de styles globale
