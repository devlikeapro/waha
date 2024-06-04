# Idea from
# https://stackoverflow.com/a/65539398/6753144
#

OWNER=devlikeapro
REPO=waha-plus

# list workflows
gh api -X GET /repos/$OWNER/$REPO/actions/workflows | jq '.workflows[] | .name,.id'

# copy the ID of the workflow you want to clear and set it
WORKFLOW_ID=40218610

# list runs
gh api -X GET /repos/$OWNER/$REPO/actions/workflows/$WORKFLOW_ID/runs --paginate | jq '.workflow_runs[] | .id'

# delete runs
gh api -X GET /repos/$OWNER/$REPO/actions/workflows/$WORKFLOW_ID/runs --paginate | jq '.workflow_runs[] | .id' | xargs -I{} gh api -X DELETE /repos/$OWNER/$REPO/actions/runs/{} --silent
