# Tracker
Project Tracker...testtest
## Utilisation
## TODO
---
# Nomenclature pour Projet JavaScript/React Native
## Règles de Code

<table border="1" style="border-collapse: collapse; width: 100%;">
  <tr>
    <th style="background-color:#2E86C1; color:white; padding: 8px;">Élément</th>
    <th style="background-color:#2874A6; color:white; padding: 8px;">Convention</th>
    <th style="background-color:#1F618D; color:white; padding: 8px;">Exemple</th>
  </tr>
  <tr>
    <td style="padding: 8px;"><b>Composants React</b></td>
    <td style="color:#3498DB; padding: 8px;">PascalCase</td>
    <td style="padding: 8px;"><code>UserProfile</code>, <code>NavigationBar</code></td>
  </tr>
  <tr>
    <td style="padding: 8px;"><b>Hooks personnalisés</b></td>
    <td style="color:#27AE60; padding: 8px;">useNomDuHook</td>
    <td style="padding: 8px;"><code>useAuthentication()</code>, <code>useForm()</code></td>
  </tr>
  <tr>
    <td style="padding: 8px;"><b>Fonctions</b></td>
    <td style="color:#27AE60; padding: 8px;">camelCase</td>
    <td style="padding: 8px;"><code>calculateDistance()</code>, <code>formatDate()</code></td>
  </tr>
  <tr>
    <td style="padding: 8px;"><b>Fonctions privées ou utilitaires</b></td>
    <td style="color:#229954; padding: 8px;">camelCase ou _camelCase</td>
    <td style="padding: 8px;"><code>_parseResponse()</code>, <code>_formatData()</code></td>
  </tr>
  <tr>
    <td style="padding: 8px;"><b>Variables d'état (React)</b></td>
    <td style="color:#F39C12; padding: 8px;">camelCase et setNomVariable</td>
    <td style="padding: 8px;"><code>const [isLoading, setIsLoading] = useState(false)</code></td>
  </tr>
  <tr>
    <td style="padding: 8px;"><b>Props</b></td>
    <td style="color:#D68910; padding: 8px;">camelCase</td>
    <td style="padding: 8px;"><code>onPress</code>, <code>isDisabled</code></td>
  </tr>
  <tr>
    <td style="padding: 8px;"><b>Constantes</b></td>
    <td style="color:#C0392B; padding: 8px;">UPPER_SNAKE_CASE</td>
    <td style="padding: 8px;"><code>API_URL</code>, <code>MAX_RETRY_ATTEMPTS</code></td>
  </tr>
  <tr>
    <td style="padding: 8px;"><b>Types (TypeScript)</b></td>
    <td style="color:#1ABC9C; padding: 8px;">PascalCase, préfixe I pour interfaces</td>
    <td style="padding: 8px;"><code>IUser</code>, <code>UserProps</code>, <code>AuthState</code></td>
  </tr>
  <tr>
    <td style="padding: 8px;"><b>Énumérations</b></td>
    <td style="color:#1ABC9C; padding: 8px;">PascalCase pour le type, UPPER_SNAKE_CASE pour les valeurs</td>
    <td style="padding: 8px;"><code>enum UserRole { ADMIN, USER, GUEST }</code></td>
  </tr>
  <tr>
    <td style="padding: 8px;"><b>Redux actions</b></td>
    <td style="color:#27AE60; padding: 8px;">DOMAIN_ACTION_TYPE</td>
    <td style="padding: 8px;"><code>USER_LOGIN_REQUEST</code></td>
  </tr>
</table>

## Règles de Nommage des Fichiers

<table border="1" style="border-collapse: collapse; width: 100%;">
  <tr>
    <th style="background-color:#2E86C1; color:white; padding: 8px;">Type de Fichier</th>
    <th style="background-color:#2874A6; color:white; padding: 8px;">Convention</th>
    <th style="background-color:#1F618D; color:white; padding: 8px;">Exemple</th>
  </tr>
  <tr>
    <td style="padding: 8px;"><b>Fichiers de composants</b></td>
    <td style="color:#8E44AD; padding: 8px;">PascalCase.jsx/.tsx</td>
    <td style="padding: 8px;"><code>UserProfile.jsx</code>, <code>Button.tsx</code></td>
  </tr>
  <tr>
    <td style="padding: 8px;"><b>Fichiers de styles</b></td>
    <td style="color:#8E44AD; padding: 8px;">PascalCase.styles.js</td>
    <td style="padding: 8px;"><code>UserProfile.styles.js</code></td>
  </tr>
  <tr>
    <td style="padding: 8px;"><b>Fichiers de configuration</b></td>
    <td style="color:#8E44AD; padding: 8px;">kebab-case.config.js</td>
    <td style="padding: 8px;"><code>api-config.js</code>, <code>theme-config.js</code></td>
  </tr>
  <tr>
    <td style="padding: 8px;"><b>Fichiers de services</b></td>
    <td style="color:#8E44AD; padding: 8px;">camelCase.service.js</td>
    <td style="padding: 8px;"><code>auth.service.js</code>, <code>api.service.js</code></td>
  </tr>
  <tr>
    <td style="padding: 8px;"><b>Fichiers de tests</b></td>
    <td style="color:#8E44AD; padding: 8px;">NomDuFichier.test.js</td>
    <td style="padding: 8px;"><code>UserProfile.test.js</code></td>
  </tr>
  <tr>
    <td style="padding: 8px;"><b>Fichiers d'écrans</b></td>
    <td style="color:#8E44AD; padding: 8px;">PascalCaseScreen.jsx</td>
    <td style="padding: 8px;"><code>HomeScreen.jsx</code>, <code>ProfileScreen.jsx</code></td>
  </tr>
  <tr>
    <td style="padding: 8px;"><b>Fichiers de hooks</b></td>
    <td style="color:#8E44AD; padding: 8px;">useNomDuHook.js</td>
    <td style="padding: 8px;"><code>useAuth.js</code>, <code>useForm.js</code></td>
  </tr>
  <tr>
    <td style="padding: 8px;"><b>Redux reducers</b></td>
    <td style="color:#8E44AD; padding: 8px;">domainReducer.js</td>
    <td style="padding: 8px;"><code>userReducer.js</code>, <code>authReducer.js</code></td>
  </tr>
  <tr>
    <td style="padding: 8px;"><b>Redux actions</b></td>
    <td style="color:#8E44AD; padding: 8px;">domainActions.js</td>
    <td style="padding: 8px;"><code>userActions.js</code>, <code>authActions.js</code></td>
  </tr>
  <tr>
    <td style="padding: 8px;"><b>Types/Interfaces (TypeScript)</b></td>
    <td style="color:#8E44AD; padding: 8px;">domain.types.ts</td>
    <td style="padding: 8px;"><code>user.types.ts</code>, <code>auth.types.ts</code></td>
  </tr>
  <tr>
    <td style="padding: 8px;"><b>Constantes</b></td>
    <td style="color:#8E44AD; padding: 8px;">domain.constants.js</td>
    <td style="padding: 8px;"><code>api.constants.js</code>, <code>theme.constants.js</code></td>
  </tr>
</table>

## Structure de Dossiers Recommandée

```
src/
├── assets/
│   ├── images/
│   └── fonts/
├── components/
│   ├── Button/
│   │   ├── Button.jsx
│   │   ├── Button.styles.js
│   │   └── Button.test.js
│   └── ...
├── screens/
│   ├── HomeScreen.jsx
│   ├── HomeScreen.styles.js
│   └── ...
├── navigation/
│   └── AppNavigator.jsx
├── services/
│   ├── api.service.js
│   └── auth.service.js
├── hooks/
│   ├── useAuth.js
│   └── useForm.js
├── store/
│   ├── actions/
│   ├── reducers/
│   └── index.js
├── utils/
│   └── helpers.js
└── constants/
    └── api.constants.js
```