"""
{{projectCapitalized}} Python SDK

{{projectDescription}}
"""

__version__ = "0.1.0"


def create_client(**kwargs):
    """Create a client for {{projectCapitalized}}.

    Args:
        **kwargs: Configuration options.

    Returns:
        dict: Client configuration.
    """
    return {
        "version": __version__,
        **kwargs,
    }

from .schemas import *
