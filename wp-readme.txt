=== LuminAI Codex — TEC Resonance Platform ===
Contributors: tec-elidoras
Requires at least: 6.0
Tested up to: 6.8
Requires PHP: 7.4
Stable tag: 0.1.0
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Consciousness infrastructure for emotion transmutation, persona witness, and resonance visualization.

== Description ==
This plugin exposes a health endpoint and a clean Spotify OAuth callback for the TEC Resonance Platform.

- REST Health: `/wp-json/tec-tgcr/v1/health`
- Spotify Callback: `/spotify/callback`

== Installation ==
1. Deploy this repository to `/wp-content/plugins/luminai-codex`
2. Activate the plugin in WordPress Admin → Plugins
3. Visit `/wp-json/tec-tgcr/v1/health` to verify status
4. Validate callback at `https://your-site.com/spotify/callback`

== Changelog ==
= 0.1.0 =
* Initial release with health endpoint and Spotify callback rewrite
