from os import path
from PIL import Image
import numpy as np
import matplotlib.pyplot as plt
import random
from scipy.ndimage import gaussian_gradient_magnitude
import os

from wordcloud import WordCloud, STOPWORDS, ImageColorGenerator

# get data directory (using getcwd() is needed to support running example in generated IPython notebook)
d = path.dirname(__file__) if "__file__" in locals() else os.getcwd()

filename_read = 'followers.txt'
with open(filename_read, 'r') as file:
    text = " ".join((file.read().split('\n'))) 
    # text = "\n".join(file.read().split("e"))


# read the mask / color image taken from
image_colouring = np.array(Image.open(path.join(d, "./Image Masks/insta.png")))
# stopwords = set(STOPWORDS)
# stopwords.add("said")

wc = WordCloud(background_color="black", max_words=69420, mask=image_colouring,
                max_font_size=60, random_state=random.randint(0,1000))
# # generate word cloud
wc.generate(text)

# create coloring from image
image_colors = ImageColorGenerator(image_colouring)

# show
fig, axes = plt.subplots(1, 1)
# axes.imshow(wc, interpolation="bilinear")
# recolor wordcloud and show
# we could also give color_func=image_colors directly in the constructor
axes.imshow(wc.recolor(color_func=image_colors), interpolation="bilinear")
# axes[2].imshow(image_colouring, cmap=plt.cm.gray, interpolation="bilinear")
# for ax in axes:
axes.set_axis_off()
plt.show()
