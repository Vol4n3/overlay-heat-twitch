# Overlay interactif twitch
## disclaimer
Je ne suis pas responsable et ni le développeur de l'extension Heat
allez sur (https://heat.j38.net/) pour plus d'infos

## Comment l'intégrer à obs

* récupérer le heatId qui se trouve dans vos extensions twitch
  il faut installer et activer Heat et dans la configuration vous trouverez
  "You channel id is 123456879"
* ajouter une source navigateur/ web browser
* configurer l'overlay sur (https://vol4n3.github.io/overlay-heat-twitch/) et copier dans le champs text l'uri afin de
  la mettre dans obs
* choisissez une bonne résolution pour votre source
* les viewers ne pourrons pas interagir sur les jeux avec un scoreboard si ils n'autorisent pas l'extension Heat à accéder aux infos de twitch

## Contribuez au code source

Le projet est fait en create react app.

Vous trouverez l'ensemble des scripts dans le package.json.

Utilisez yarn pour le projet