import { NextRequest, NextResponse } from "next/server";
import SteamUser from "steam-user";
import GlobalOffensive from "globaloffensive";

// Cette ligne est critique - elle indique à Next.js d'utiliser le runtime Node.js pour cette route
export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  // Récupérer le steamid de l'URL
  const { searchParams } = new URL(request.url);
  const steamid = searchParams.get("steamid");
  console.log("Requête reçue avec steamid:", steamid);

  if (!steamid) {
    return NextResponse.json({ error: "SteamID required" }, { status: 400 });
  }

  try {
    // Création d'un client Steam
    const user = new SteamUser();
    const csgo = new GlobalOffensive(user);

    const playerData = await new Promise((resolve, reject) => {
      // Connexion à Steam
      user.logOn({
        accountName: process.env.STEAM_USERNAME,
        password: process.env.STEAM_PASSWORD,
      });

      user.on("loggedOn", () => {
        console.log("Logged into Steam");
        user.setPersona(SteamUser.EPersonaState.Online);
        user.gamesPlayed([730]); // ID du jeu CS2/CSGO
      });

      user.on("error", (err) => {
        console.error("Steam Error:", err);
        reject(new Error(`Steam login error: ${err.message}`));
        user.logOff();
      });

      csgo.on("connectedToGC", () => {
        console.log("Connected to CS2 game coordinator");
        // Demander les stats du joueur
        csgo.requestPlayersProfile(steamid, (profile) => {
          console.log("Profile received:", profile);
          resolve(profile);
          // Important: déconnexion après avoir obtenu les données
          user.logOff();
        });
      });

      // Timeout après 15 secondes si aucune réponse
      setTimeout(() => {
        reject(new Error("Timeout waiting for CS2 game coordinator"));
        user.logOff();
      }, 15000);
    });

    return NextResponse.json(playerData);
  } catch (error: any) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: error.message || "Une erreur inconnue s'est produite" },
      { status: 500 }
    );
  }
}
