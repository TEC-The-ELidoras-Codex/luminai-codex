"""
Spotify URL Utilities

This module provides utilities for working with Spotify URLs,
extracting track information, and integrating with the Spotify API
for music-related AI applications.
"""

import re
import urllib.parse
from typing import Dict, List, Optional, Any, Tuple
from dataclasses import dataclass
from enum import Enum


class SpotifyItemType(Enum):
    """Types of Spotify items that can be handled"""
    TRACK = "track"
    ALBUM = "album"
    PLAYLIST = "playlist"
    ARTIST = "artist"
    SHOW = "show"
    EPISODE = "episode"


@dataclass
class SpotifyItem:
    """Represents a Spotify item (track, album, etc.)"""
    item_type: SpotifyItemType
    item_id: str
    name: Optional[str] = None
    artist: Optional[str] = None
    album: Optional[str] = None
    url: Optional[str] = None
    uri: Optional[str] = None
    external_urls: Optional[Dict[str, str]] = None
    popularity: Optional[int] = None
    duration_ms: Optional[int] = None
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary"""
        return {
            "item_type": self.item_type.value,
            "item_id": self.item_id,
            "name": self.name,
            "artist": self.artist,
            "album": self.album,
            "url": self.url,
            "uri": self.uri,
            "external_urls": self.external_urls,
            "popularity": self.popularity,
            "duration_ms": self.duration_ms
        }


class SpotifyURLParser:
    """
    Parser for Spotify URLs and URIs
    
    Handles various Spotify URL formats:
    - Web URLs: https://open.spotify.com/track/4iV5W9uYEdYUVa79Axb7Rh
    - URIs: spotify:track:4iV5W9uYEdYUVa79Axb7Rh
    - Embed URLs: https://open.spotify.com/embed/track/4iV5W9uYEdYUVa79Axb7Rh
    """
    
    # Regex patterns for different URL formats
    WEB_URL_PATTERN = re.compile(
        r'https://open\.spotify\.com/(?:embed/)?'
        r'(?P<type>track|album|playlist|artist|show|episode)/'
        r'(?P<id>[a-zA-Z0-9]{22})'
        r'(?:\?.*)?'
    )
    
    URI_PATTERN = re.compile(
        r'spotify:(?P<type>track|album|playlist|artist|show|episode):(?P<id>[a-zA-Z0-9]{22})'
    )
    
    @classmethod
    def parse_url(cls, url: str) -> Optional[SpotifyItem]:
        """
        Parse a Spotify URL or URI and extract information
        
        Args:
            url: Spotify URL or URI to parse
            
        Returns:
            SpotifyItem if parsing succeeds, None otherwise
        """
        url = url.strip()
        
        # Try web URL pattern first
        match = cls.WEB_URL_PATTERN.match(url)
        if match:
            item_type = SpotifyItemType(match.group('type'))
            item_id = match.group('id')
            
            return SpotifyItem(
                item_type=item_type,
                item_id=item_id,
                url=url,
                uri=f"spotify:{item_type.value}:{item_id}"
            )
        
        # Try URI pattern
        match = cls.URI_PATTERN.match(url)
        if match:
            item_type = SpotifyItemType(match.group('type'))
            item_id = match.group('id')
            
            return SpotifyItem(
                item_type=item_type,
                item_id=item_id,
                uri=url,
                url=f"https://open.spotify.com/{item_type.value}/{item_id}"
            )
        
        return None
    
    @classmethod
    def extract_id_from_url(cls, url: str) -> Optional[str]:
        """Extract just the Spotify ID from a URL"""
        item = cls.parse_url(url)
        return item.item_id if item else None
    
    @classmethod
    def extract_type_from_url(cls, url: str) -> Optional[SpotifyItemType]:
        """Extract just the item type from a URL"""
        item = cls.parse_url(url)
        return item.item_type if item else None
    
    @classmethod
    def is_valid_spotify_url(cls, url: str) -> bool:
        """Check if a URL is a valid Spotify URL"""
        return cls.parse_url(url) is not None
    
    @classmethod
    def convert_to_uri(cls, url: str) -> Optional[str]:
        """Convert a Spotify URL to URI format"""
        item = cls.parse_url(url)
        return item.uri if item else None
    
    @classmethod
    def convert_to_url(cls, uri: str) -> Optional[str]:
        """Convert a Spotify URI to URL format"""
        item = cls.parse_url(uri)
        return item.url if item else None


class SpotifyPlaylistExtractor:
    """
    Extract information from Spotify playlist URLs
    
    Handles playlist-specific functionality like extracting track lists,
    parsing collaborative playlists, etc.
    """
    
    @staticmethod
    def extract_playlist_info(url: str) -> Optional[Dict[str, Any]]:
        """
        Extract basic playlist information from URL
        
        Args:
            url: Spotify playlist URL
            
        Returns:
            Dictionary with playlist info or None
        """
        item = SpotifyURLParser.parse_url(url)
        
        if not item or item.item_type != SpotifyItemType.PLAYLIST:
            return None
        
        return {
            "playlist_id": item.item_id,
            "url": item.url,
            "uri": item.uri,
            "type": "playlist"
        }
    
    @staticmethod
    def is_playlist_url(url: str) -> bool:
        """Check if URL is a Spotify playlist"""
        item = SpotifyURLParser.parse_url(url)
        return item is not None and item.item_type == SpotifyItemType.PLAYLIST


class SpotifyTrackExtractor:
    """
    Extract information from Spotify track URLs
    """
    
    @staticmethod
    def extract_track_info(url: str) -> Optional[Dict[str, Any]]:
        """
        Extract basic track information from URL
        
        Args:
            url: Spotify track URL
            
        Returns:
            Dictionary with track info or None
        """
        item = SpotifyURLParser.parse_url(url)
        
        if not item or item.item_type != SpotifyItemType.TRACK:
            return None
        
        return {
            "track_id": item.item_id,
            "url": item.url,
            "uri": item.uri,
            "type": "track"
        }
    
    @staticmethod
    def is_track_url(url: str) -> bool:
        """Check if URL is a Spotify track"""
        item = SpotifyURLParser.parse_url(url)
        return item is not None and item.item_type == SpotifyItemType.TRACK


class SpotifyURLBatch:
    """
    Process multiple Spotify URLs in batch operations
    """
    
    @staticmethod
    def parse_multiple_urls(urls: List[str]) -> List[Optional[SpotifyItem]]:
        """
        Parse multiple Spotify URLs
        
        Args:
            urls: List of Spotify URLs to parse
            
        Returns:
            List of SpotifyItem objects (None for invalid URLs)
        """
        return [SpotifyURLParser.parse_url(url) for url in urls]
    
    @staticmethod
    def filter_valid_urls(urls: List[str]) -> List[str]:
        """
        Filter out invalid Spotify URLs from a list
        
        Args:
            urls: List of URLs to filter
            
        Returns:
            List of valid Spotify URLs only
        """
        return [url for url in urls if SpotifyURLParser.is_valid_spotify_url(url)]
    
    @staticmethod
    def group_by_type(urls: List[str]) -> Dict[str, List[str]]:
        """
        Group Spotify URLs by their type
        
        Args:
            urls: List of Spotify URLs
            
        Returns:
            Dictionary with types as keys and URL lists as values
        """
        groups = {item_type.value: [] for item_type in SpotifyItemType}
        groups["invalid"] = []
        
        for url in urls:
            item = SpotifyURLParser.parse_url(url)
            if item:
                groups[item.item_type.value].append(url)
            else:
                groups["invalid"].append(url)
        
        return groups
    
    @staticmethod
    def extract_all_ids(urls: List[str]) -> List[str]:
        """
        Extract all Spotify IDs from a list of URLs
        
        Args:
            urls: List of Spotify URLs
            
        Returns:
            List of Spotify IDs (empty list if no valid URLs)
        """
        ids = []
        for url in urls:
            item_id = SpotifyURLParser.extract_id_from_url(url)
            if item_id:
                ids.append(item_id)
        return ids


class SpotifyEmbedGenerator:
    """
    Generate Spotify embed codes for web applications
    """
    
    @staticmethod
    def generate_embed_url(url: str, **kwargs) -> Optional[str]:
        """
        Generate Spotify embed URL from regular URL
        
        Args:
            url: Regular Spotify URL
            **kwargs: Additional parameters (theme, width, height, etc.)
            
        Returns:
            Embed URL or None if invalid
        """
        item = SpotifyURLParser.parse_url(url)
        if not item:
            return None
        
        base_url = f"https://open.spotify.com/embed/{item.item_type.value}/{item.item_id}"
        
        # Add query parameters
        params = {}
        if kwargs.get('theme'):
            params['theme'] = kwargs['theme']
        if kwargs.get('utm_source'):
            params['utm_source'] = kwargs['utm_source']
        
        if params:
            query_string = urllib.parse.urlencode(params)
            base_url += f"?{query_string}"
        
        return base_url
    
    @staticmethod
    def generate_iframe_embed(url: str, width: int = 300, height: int = 380, **kwargs) -> Optional[str]:
        """
        Generate HTML iframe embed code
        
        Args:
            url: Spotify URL to embed
            width: iframe width
            height: iframe height
            **kwargs: Additional iframe attributes
            
        Returns:
            HTML iframe code or None if invalid
        """
        embed_url = SpotifyEmbedGenerator.generate_embed_url(url, **kwargs)
        if not embed_url:
            return None
        
        iframe_attrs = {
            'src': embed_url,
            'width': str(width),
            'height': str(height),
            'frameborder': '0',
            'allowtransparency': 'true',
            'allow': 'encrypted-media'
        }
        
        # Add custom attributes
        for key, value in kwargs.items():
            if key not in ['theme', 'utm_source']:  # Skip URL params
                iframe_attrs[key] = str(value)
        
        attr_string = ' '.join(f'{k}="{v}"' for k, v in iframe_attrs.items())
        return f'<iframe {attr_string}></iframe>'


# Utility functions for common operations
def parse_spotify_url(url: str) -> Optional[SpotifyItem]:
    """Parse a Spotify URL (convenience function)"""
    return SpotifyURLParser.parse_url(url)


def is_spotify_url(url: str) -> bool:
    """Check if a URL is a Spotify URL (convenience function)"""
    return SpotifyURLParser.is_valid_spotify_url(url)


def get_spotify_id(url: str) -> Optional[str]:
    """Convenience function to extract Spotify ID"""
    return SpotifyURLParser.extract_id_from_url(url)

def sanitize_spotify_url(url: str) -> Optional[str]:
    """
    Sanitize a Spotify URL by parsing and reconstructing it
    
    Args:
        url: Potentially malformed or dirty Spotify URL
        
    Returns:
        Clean Spotify URL or None if invalid
    """
    parsed = SpotifyURLParser.parse_url(url)
    if parsed:
        return parsed.url
    return None


def get_spotify_type(url: str) -> Optional[str]:
    """Get Spotify item type from URL (convenience function)"""
    item_type = SpotifyURLParser.extract_type_from_url(url)
    return item_type.value if item_type else None


def convert_spotify_url(url: str, output_format: str = "uri") -> Optional[str]:
    """
    Convert between Spotify URL formats
    
    Args:
        url: Input Spotify URL or URI
        output_format: "uri" or "url"
        
    Returns:
        Converted URL/URI or None if invalid
    """
    if output_format == "uri":
        return SpotifyURLParser.convert_to_uri(url)
    elif output_format == "url":
        return SpotifyURLParser.convert_to_url(url)
    else:
        raise ValueError("output_format must be 'uri' or 'url'")


def extract_spotify_urls_from_text(text: str) -> List[str]:
    """
    Extract all Spotify URLs from a text string
    
    Args:
        text: Text to search for Spotify URLs
        
    Returns:
        List of Spotify URLs found in the text
    """
    # Combined pattern for both URL formats
    pattern = re.compile(
        r'(?:https://open\.spotify\.com/(?:embed/)?(?:track|album|playlist|artist|show|episode)/[a-zA-Z0-9]{22}(?:\?[^\s]*)?|'
        r'spotify:(?:track|album|playlist|artist|show|episode):[a-zA-Z0-9]{22})',
        re.IGNORECASE
    )
    
    matches = pattern.findall(text)
    return list(set(matches))  # Remove duplicates


# Example usage and testing
def main():
    """Test Spotify URL utilities"""
    test_urls = [
        "https://open.spotify.com/track/4iV5W9uYEdYUVa79Axb7Rh",
        "spotify:track:4iV5W9uYEdYUVa79Axb7Rh",
        "https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M",
        "https://open.spotify.com/artist/4Z8W4fKeB5YxbusRsdQVPb",
        "invalid_url"
    ]
    
    print("🎵 Spotify URL Utilities Test")
    print("=" * 50)
    
    for url in test_urls:
        print(f"\nTesting: {url}")
        
        item = parse_spotify_url(url)
        if item:
            print(f"  ✅ Valid {item.item_type.value}")
            print(f"  ID: {item.item_id}")
            print(f"  URI: {item.uri}")
            print(f"  URL: {item.url}")
        else:
            print("  ❌ Invalid URL")
    
    # Test batch processing
    print(f"\n📊 Batch Processing:")
    valid_urls = SpotifyURLBatch.filter_valid_urls(test_urls)
    print(f"Valid URLs: {len(valid_urls)}")
    
    grouped = SpotifyURLBatch.group_by_type(test_urls)
    for type_name, urls in grouped.items():
        if urls:
            print(f"  {type_name}: {len(urls)} items")


if __name__ == "__main__":
    main()