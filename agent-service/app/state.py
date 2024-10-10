"""Define the shared values."""

from __future__ import annotations

from dataclasses import dataclass


@dataclass(kw_only=True)
class State:
    """Main graph state."""

    # messages: Annotated[list[AnyMessage], add_messages]
    # """The messages in the conversation."""
    
    # feedback_only: bool = False
    # """Indicates if only wants the customer feedback analysis."""
    
    
    feedback: str
    """The customer feedback provided from the user for analysis."""
    
    category: str
    """The category of the feedback analyzed by the ai agent."""
    
    entities: list[str]
    """The entities extracted from the feedback."""

    summary: str
    """A summary of the feedback."""

    sentiment: str
    """The sentiment of the feedback."""

    priority: str
    """The priority assigned to the feedback."""

    route: str
    """The route based on the feedback category."""

    action_items: list[str]
    """The action items generated from the feedback."""

    trend_analysis: str
    """The result of the trend analysis."""


__all__ = [
    "State",
]