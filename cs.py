def generate_key_matrix(key):
    key = key.upper().replace("J", "I")  # Replace J with I as per Playfair Cipher rules
    matrix = []
    seen = set()
    for char in key:
        if char not in seen and char.isalpha():
            matrix.append(char)
            seen.add(char)

    # Fill the matrix with remaining letters
    for char in "ABCDEFGHIKLMNOPQRSTUVWXYZ":
        if char not in seen:
            matrix.append(char)
            seen.add(char)

    return [matrix[i:i+5] for i in range(0, 25, 5)]


def find_position(matrix, char):
    for row in range(5):
        for col in range(5):
            if matrix[row][col] == char:
                return row, col
    return None


def process_pairs(text):
    text = text.upper().replace("J", "I")  # Replace J with I
    pairs = []
    i = 0

    while i < len(text):
        char1 = text[i]
        char2 = text[i + 1] if i + 1 < len(text) else 'X'
        
        if char1 == char2:
            pairs.append((char1, 'X'))
            i += 1
        else:
            pairs.append((char1, char2))
            i += 2

    # If text length is odd, add 'X' at the end
    if len(text) % 2 != 0:
        pairs.append((text[-1], 'X'))

    return pairs


def playfair_encrypt(key, plaintext):
    matrix = generate_key_matrix(key)
    pairs = process_pairs(plaintext)
    ciphertext = ""

    for char1, char2 in pairs:
        row1, col1 = find_position(matrix, char1)
        row2, col2 = find_position(matrix, char2)

        if row1 == row2:  # Same row
            ciphertext += matrix[row1][(col1 + 1) % 5] + matrix[row2][(col2 + 1) % 5]
        elif col1 == col2:  # Same column
            ciphertext += matrix[(row1 + 1) % 5][col1] + matrix[(row2 + 1) % 5][col2]
        else:  # Rectangle
            ciphertext += matrix[row1][col2] + matrix[row2][col1]

    return ciphertext


def playfair_decrypt(key, ciphertext):
    matrix = generate_key_matrix(key)
    pairs = process_pairs(ciphertext)
    plaintext = ""

    for char1, char2 in pairs:
        row1, col1 = find_position(matrix, char1)
        row2, col2 = find_position(matrix, char2)

        if row1 == row2:  # Same row
            plaintext += matrix[row1][(col1 - 1) % 5] + matrix[row2][(col2 - 1) % 5]
        elif col1 == col2:  # Same column
            plaintext += matrix[(row1 - 1) % 5][col1] + matrix[(row2 - 1) % 5][col2]
        else:  # Rectangle
            plaintext += matrix[row1][col2] + matrix[row2][col1]

    return plaintext


# Example Usage
key = "PLAYFAIR"
plaintext = "HELLO WORLD"
ciphertext = playfair_encrypt(key, plaintext.replace(" ", ""))
decrypted_text = playfair_decrypt(key, ciphertext)

print(f"Key: {key}")
print(f"Plaintext: {plaintext}")
print(f"Ciphertext: {ciphertext}")
print(f"Decrypted Text: {decrypted_text}")
