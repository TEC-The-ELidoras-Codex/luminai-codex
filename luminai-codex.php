<?php
/**
 * Plugin Name: LuminAI Codex — TEC Resonance Platform
 * Description: Consciousness infrastructure for emotion transmutation, persona witness, and resonance visualization.
 * Version: 0.1.0
 * Author: TEC • The Elidoras Codex
 * Author URI: https://github.com/TEC-The-ELidoras-Codex
 * Text Domain: luminai-codex
 * Requires at least: 6.0
 * Requires PHP: 7.4
 * License: GPL-2.0-or-later
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

// Namespace-like prefix
if (!defined('TEC_LUMINAI_CODEX_VER')) {
    define('TEC_LUMINAI_CODEX_VER', '0.1.0');
}
if (!defined('TEC_LUMINAI_CODEX_FILE')) {
    define('TEC_LUMINAI_CODEX_FILE', __FILE__);
}
if (!defined('TEC_LUMINAI_CODEX_DIR')) {
    define('TEC_LUMINAI_CODEX_DIR', plugin_dir_path(__FILE__));
}
if (!defined('TEC_LUMINAI_CODEX_URL')) {
    define('TEC_LUMINAI_CODEX_URL', plugin_dir_url(__FILE__));
}

// ---------- Helpers ----------
/**
 * Retrieve environment/config value in a safe, host-agnostic way.
 * Preference order: constant -> getenv -> empty string
 */
function tec_luminai_getenv(string $key, string $default = ''): string {
    if (defined($key)) {
        return (string) constant($key);
    }
    $v = getenv($key);
    return $v !== false ? (string) $v : $default;
}

// ---------- REST: Health Endpoint ----------
add_action('rest_api_init', function () {
    register_rest_route('tec-tgcr/v1', '/health', [
        'methods'  => 'GET',
        'callback' => function () {
            return new WP_REST_Response([
                'status'    => 'ok',
                'timestamp' => current_time('mysql'),
                'plugin'    => 'luminai-codex',
                'version'   => TEC_LUMINAI_CODEX_VER,
            ], 200);
        },
        'permission_callback' => '__return_true',
    ]);
});

// ---------- Spotify OAuth Callback ----------
// Add rewrite rule for /spotify/callback → sets query var tec_spotify_callback=1
add_action('init', function () {
    add_rewrite_rule('^spotify/callback/?$', 'index.php?tec_spotify_callback=1', 'top');
});

// Register custom query var
add_filter('query_vars', function ($vars) {
    $vars[] = 'tec_spotify_callback';
    return $vars;
});

// Flush rewrite rules on activation/deactivation
register_activation_hook(__FILE__, function () {
    // Ensure our rewrite rule is registered before flush
    add_rewrite_rule('^spotify/callback/?$', 'index.php?tec_spotify_callback=1', 'top');
    flush_rewrite_rules();
});

register_deactivation_hook(__FILE__, function () {
    flush_rewrite_rules();
});

// Handle the callback request early in template load
add_action('template_redirect', function () {
    if (intval(get_query_var('tec_spotify_callback')) === 1) {
        // Read possible OAuth params (no secret exchange here)
        $code  = isset($_GET['code']) ? sanitize_text_field(wp_unslash($_GET['code'])) : '';
        $state = isset($_GET['state']) ? sanitize_text_field(wp_unslash($_GET['state'])) : '';
        $error = isset($_GET['error']) ? sanitize_text_field(wp_unslash($_GET['error'])) : '';

        $exchanged = false;
        $exchange_error = '';

        // Attempt a minimal server-side token exchange if env is configured and no error present
        $client_id = tec_luminai_getenv('SPOTIFY_CLIENT_ID');
        $client_secret = tec_luminai_getenv('SPOTIFY_CLIENT_SECRET');
        $redirect_uri = tec_luminai_getenv('SPOTIFY_REDIRECT_URI', home_url('/spotify/callback'));

        if ($code && !$error && $client_id && $client_secret && $redirect_uri) {
            // Prepare token request
            $token_url = 'https://accounts.spotify.com/api/token';
            $auth      = base64_encode($client_id . ':' . $client_secret);
            $args      = [
                'timeout' => 15,
                'headers' => [
                    'Authorization' => 'Basic ' . $auth,
                    'Content-Type'  => 'application/x-www-form-urlencoded',
                ],
                'body'    => [
                    'grant_type'   => 'authorization_code',
                    'code'         => $code,
                    'redirect_uri' => $redirect_uri,
                ],
            ];
            $res = wp_remote_post($token_url, $args);
            if (!is_wp_error($res)) {
                $code_rc = wp_remote_retrieve_response_code($res);
                $body    = wp_remote_retrieve_body($res);
                $json    = json_decode($body, true);
                if ($code_rc === 200 && is_array($json) && !empty($json['access_token'])) {
                    // Store tokens ephemerally in a transient keyed by state (if present)
                    $ttl = isset($json['expires_in']) ? intval($json['expires_in']) : 3600;
                    $payload = [
                        'obtained_at'   => time(),
                        'access_token'  => $json['access_token'],
                        'refresh_token' => isset($json['refresh_token']) ? $json['refresh_token'] : '',
                        'scope'         => isset($json['scope']) ? $json['scope'] : '',
                        'token_type'    => isset($json['token_type']) ? $json['token_type'] : 'Bearer',
                        'expires_in'    => $ttl,
                    ];
                    if ($state) {
                        set_transient('tec_spotify_tok_' . sanitize_key($state), $payload, $ttl > 60 ? $ttl - 60 : $ttl);
                    } else {
                        // Fallback: single-slot transient (overwritten)
                        set_transient('tec_spotify_tok_last', $payload, $ttl > 60 ? $ttl - 60 : $ttl);
                    }
                    $exchanged = true;
                } else {
                    $exchange_error = 'Token exchange failed (HTTP ' . esc_html((string) $code_rc) . ').';
                }
            } else {
                $exchange_error = 'Network error during token exchange: ' . esc_html($res->get_error_message());
            }
        }

        // Render verification HTML response
        status_header(200);
        nocache_headers();
        header('Content-Type: text/html; charset=utf-8');
        echo '<!doctype html><html><head><meta charset="utf-8"><title>Spotify Callback</title></head><body style="font-family:system-ui,Segoe UI,Arial,sans-serif;padding:2rem">';
        echo '<h1>LuminAI Codex — Spotify Callback</h1>';
        if ($error) {
            echo '<p><strong>Error:</strong> ' . esc_html($error) . '</p>';
        } elseif ($code && $exchanged) {
            echo '<p>Authorization code received and exchanged successfully.</p>';
            echo '<p>Tokens stored securely (ephemeral) for follow-up processing.</p>';
        } elseif ($code && !$exchanged) {
            echo '<p>Received authorization code.</p>';
            if ($exchange_error) {
                echo '<p><strong>Exchange note:</strong> ' . $exchange_error . '</p>';
            } else {
                echo '<p><em>Token exchange skipped</em> — missing configuration. Configure SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, and SPOTIFY_REDIRECT_URI.</p>';
            }
        } else {
            echo '<p>No authorization parameters detected.</p>';
        }
        if ($state) {
            echo '<p><strong>State:</strong> ' . esc_html($state) . '</p>';
        }
        echo '<p>Next: Backend will pick up tokens via transient and bind to session/user.</p>';
        echo '<p><a href="' . esc_url(home_url('/')) . '">Return to site</a></p>';
        echo '</body></html>';
        exit;
    }
});

// ---------- Admin Notices: Missing Spotify Configuration ----------
add_action('admin_notices', function () {
    if (!current_user_can('manage_options')) {
        return;
    }
    $cid = tec_luminai_getenv('SPOTIFY_CLIENT_ID');
    $sec = tec_luminai_getenv('SPOTIFY_CLIENT_SECRET');
    if (!$cid || !$sec) {
        echo '<div class="notice notice-warning"><p><strong>LuminAI Codex:</strong> Spotify OAuth is not fully configured. Please set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET in your environment.</p></div>';
    }
});
