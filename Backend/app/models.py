# from pydantic import BaseModel
# from typing import List, Optional

# class ScoringRequest(BaseModel):
#     jd_labels: List[str]
#     candidate_labels: List[str]
#     priority_labels: Optional[List[str]] = []
#     use_semantic: Optional[bool] = False

# class ScoringResponse(BaseModel):
#     score: float
#     matched_labels: List[str]
#     missing_labels: List[str]
