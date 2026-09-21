<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <title>Activités — MI.C.L.A</title>

  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: Arial, Helvetica, sans-serif;
      background: #020817;
      color: #fff;
    }

    .page {
      min-height: 100vh;
      padding: 20px 15px 40px;

      background:
        radial-gradient(
          circle at 50% 0%,
          rgba(20,65,125,.45),
          transparent 42%
        ),
        linear-gradient(
          180deg,
          #081d3d,
          #041229 50%,
          #020817
        );
    }

    .container {
      width: 100%;
      max-width: 600px;
      margin: auto;
    }

    /* HEADER */

    header {
      text-align: center;
      margin-bottom: 25px;
    }

    .back {
      display: inline-block;
      color: #d8b45a;
      text-decoration: none;
      font-weight: bold;
      margin-bottom: 20px;
    }

    .logo {
      width: 90px;
      height: 90px;
      object-fit: cover;
      border-radius: 50%;
      border: 2px solid #d8b45a;
      margin-bottom: 12px;
    }

    .church-name {
      color: #d8b45a;
      font-size: 21px;
      font-weight: bold;
      letter-spacing: 3px;
    }

    .church-title {
      color: #cbd3df;
      font-size: 12px;
      letter-spacing: 2px;
      margin-top: 5px;
    }

    .page-title {
      font-size: 26px;
      margin-top: 25px;
    }

    .page-description {
      color: #9ca9bb;
      line-height: 1.6;
      margin-top: 8px;
    }

    /* LISTE */

    #activities-container {
      display: flex;
      flex-direction: column;
      gap: 25px;
    }

    /* CARTE */

    .activity-card {
      background: #071226;
      border: 1px solid rgba(216,180,90,.35);
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 12px 35px rgba(0,0,0,.3);
    }

    /* AFFICHE */

    .poster-area {
      width: 100%;
      background: #010611;
    }

    .poster-area img {
      width: 100%;
      height: auto;
      max-height: 650px;
      object-fit: contain;
      display: block;
    }

    /* CONTENU */

    .activity-content {
      padding: 20px;
    }

    .badge {
      display: inline-block;
      color: #d8b45a;
      background: rgba(216,180,90,.10);
      border: 1px solid rgba(216,180,90,.25);
      border-radius: 20px;
      padding: 6px 11px;
      font-size: 11px;
      font-weight: bold;
      margin-bottom: 12px;
    }

    .activity-title {
      font-size: 23px;
      line-height: 1.3;
      margin-bottom: 15px;
      color: #fff;
    }

    /* DESCRIPTION */

    .description-box {
      background: #0b1830;
      border-radius: 13px;
      padding: 15px;
      margin-bottom: 18px;
    }

    .description-title {
      color: #d8b45a;
      font-size: 13px;
      font-weight: bold;
      margin-bottom: 8px;
    }

    .description {
      color: #c5cedb;
      line-height: 1.7;
      white-space: pre-line;
      font-size: 14px;
    }

    /* INFORMATIONS */

    .information-box {
      display: flex;
      flex-direction: column;
      gap: 10px;

      margin-bottom: 18px;
    }

    .information {
      background: #0b1830;
      border-radius: 11px;
      padding: 12px;
      color: #d9e0e9;
      font-size: 14px;
    }

    .information strong {
      color: #d8b45a;
    }

    /* VIDÉO */

    .video-box {
      margin-bottom: 18px;
    }

    .video-box video {
      width: 100%;
      border-radius: 13px;
    }

    /* BOUTONS */

    .buttons {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .button {
      display: block;
      width: 100%;
      padding: 14px;
      border-radius: 12px;
      text-align: center;
      text-decoration: none;
      color: white;
      font-weight: bold;
      background: #111d34;
      border: 1px solid rgba(216,180,90,.3);
    }

    .button-whatsapp {
      background: #25D366;
      border: none;
    }

    .button-link {
      background: #d8b45a;
      color: #020817;
      border: none;
    }

    /* AUCUNE ACTIVITÉ */

    .empty {
      text-align: center;
      padding: 40px 20px;
      background: #071226;
      border: 1px solid rgba(216,180,90,.25);
      border-radius: 20px;
    }

    .empty-icon {
      font-size: 45px;
      margin-bottom: 15px;
    }

    .empty h2 {
      color: #d8b45a;
      margin-bottom: 10px;
    }

    .empty p {
      color: #8997aa;
      line-height: 1.6;
    }

    /* FOOTER */

    footer {
      text-align: center;
      color: #71809a;
      font-size: 11px;
      line-height: 1.6;
      margin-top: 30px;
    }

    @media (max-width: 400px) {

      .activity-content {
        padding: 16px;
      }

      .activity-title {
        font-size: 20px;
      }

    }

  </style>
</head>

<body>

<div class="page">

  <main class="container">

    <a href="index.html" class="back">
      ← Retour à l'accueil
    </a>

    <header>

      <img
        src="assets/images/eglise.jpg"
        alt="MI.C.L.A"
        class="logo"
      >

      <div class="church-name">
        MI.C.L.A
      </div>

      <div class="church-title">
        CITÉ DE REFUGE
      </div>

      <h1 class="page-title">
        ⭐ Activités
      </h1>

      <p class="page-description">
        Retrouvez ici les affiches, annonces et informations
        des activités publiées par l'administration.
      </p>

    </header>


    <!-- ACTIVITÉS PUBLIÉES -->

    <section id="activities-container"></section>


    <footer>
      MI.C.L.A — Cité de Refuge<br>
      © 2026 — Tous droits réservés
    </footer>

  </main>

</div>


<script src="js/activites.js"></script>

</body>
</html>