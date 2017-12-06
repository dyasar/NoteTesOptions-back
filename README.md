db.getCollection('options').insertMany([
    {
        'nom' : ‘Sémantique des Langages’ ,
        'description' : 'Cette UE a pour but de donner les bases de la sémantique des langages informatiques et son utilisation pour la vérification de propriétés de programmes.',
        'prof' : 'Didier GALMICHE'
    },
    {

        'nom' : 'Infographie' ,
        'description' : 'L’objectif de cette UE est d’acquérir les techniques fondamentales de l’informatique graphique.',
        'prof' : 'Dmitry SOKOLOV'
    },
    {

        'nom' : 'Preuves et Démonstration Automatisée' ,
        'description' : 'Cette UE présente les méthodes et techniques de base de la compilation des langages principalement impératifs ainsi que la certification via les machines abstraites.',
        'prof' : 'Didier GALMICHE'
    }
,
    {

        'nom' : 'Systèmes de gestion de bases de données' ,
        'description' : 'L’objectif est de connaître les diverses fonctions offertes par un SGBD (intégrité, protection et partage de données, sécurité de fonctionnement, optimisation des requêtes), en complément des fonctions « de base » (description et manipulation de données) supposées acquises. Cette UE montre comment les éléments « découverts » lors de la conception (règles de gestion, contraintes, etc.) peuvent être implantés en utilisant un SGBD.',
        'prof' : 'Naser BOUDJLIDA'
    }

])


