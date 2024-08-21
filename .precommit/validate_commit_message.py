import subprocess
import sys


def get_staged_files():
    result = subprocess.run(["git", "diff", "--cached", "--name-only"], stdout=subprocess.PIPE, text=True)
    files = result.stdout.splitlines()
    return files


def get_commit_message(commit_msg_filepath):
    with open(commit_msg_filepath, 'r') as f:
        return f.readline().strip()


def main():
    commit_msg_filepath = sys.argv[1]
    commit_message = get_commit_message(commit_msg_filepath)
    staged_files = get_staged_files()

    has_plus_changes = any(f.startswith('src/plus') for f in staged_files)
    print(commit_message)
    starts_with_plus = commit_message.startswith('[PLUS]')

    if has_plus_changes and not starts_with_plus:
        print("'[PLUS]' not found in commit message, but there's changes are from 'src/plus'.")
        return 1

    if starts_with_plus and not all(f.startswith('src/plus') for f in staged_files):
        print("'[PLUS]' found in commit message, but there's changes from other directories. \n"
              "Changes MUST be only from 'src/plus'.")
        return 1

    return 0


if __name__ == "__main__":
    sys.exit(main())
