// Copyright (c) ppy Pty Ltd <contact@ppy.sh>. Licensed under the MIT Licence.
// See the LICENCE file in the repository root for full licence text.

// ═══════════════════════════════════════════════════════════════════════════
//  SCHRITT 1: Deploye deinen Auth-Server auf Railway (siehe README.md)
//  SCHRITT 2: Ersetze DEINE-RAILWAY-URL.up.railway.app mit deiner echten URL
// ═══════════════════════════════════════════════════════════════════════════

namespace osu.Game.Online
{
    public class DevelopmentEndpointConfiguration : EndpointConfiguration
    {
        // ── Deine eigene gehostete Domain (nach Railway Deploy) ──────────────
        private const string CustomServerUrl = "https://DEINE-RAILWAY-URL.up.railway.app";

        public DevelopmentEndpointConfiguration()
        {
            // Dein eigener Auth-Server statt dev.ppy.sh
            WebsiteUrl = CustomServerUrl;
            APIUrl = CustomServerUrl;

            // Diese bleiben gleich (für OAuth mit ppy.sh)
            APIClientSecret = @"3LP2mhUrV89xxzD1YKNndXHEhWWCRLPNKioZ9ymT";
            APIClientID = "5";

            // SignalR Endpoints — ebenfalls dein Server
            SpectatorUrl = $@"{CustomServerUrl}/signalr/spectator";
            MultiplayerUrl = $@"{CustomServerUrl}/signalr/multiplayer";
            MetadataUrl = $@"{CustomServerUrl}/signalr/metadata";
            BeatmapSubmissionServiceUrl = $@"{CustomServerUrl}/beatmap-submission";
        }
    }
}
