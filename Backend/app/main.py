# from fastapi import FastAPI
# from app.models import ScoringRequest, ScoringResponse
# from app.scorer import compute_weighted_similarity as compute_score

# app = FastAPI(title="AI Hiring Assistant - Scorer")

# @app.post("/score", response_model=ScoringResponse)
# async def score_candidate(data: ScoringRequest):
#     score, matched, missing = compute_score(
#         jd_labels=data.jd_labels,
#         candidate_labels=data.candidate_labels,
#         priority_labels=data.priority_labels,
#         use_semantic=data.use_semantic
#     )
#     return ScoringResponse(score=score, matched_labels=matched, missing_labels=missing)
