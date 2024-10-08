from IPython.display import Image, display
from app.agent import graph

try:
    # Generate the image
    image_data = graph.get_graph(xray=True).draw_mermaid_png()
    
    # Save the image to a file
    with open("graph_image.png", "wb") as image_file:
        image_file.write(image_data)
    print("Image saved as graph_image.png")
except Exception as e:
    # This requires some extra dependencies and is optional
    print(f"An error occurred: {e}")