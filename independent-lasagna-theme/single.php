<?php
/**
 * Single blog post.
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
get_header();

while ( have_posts() ) :
	the_post();
	?>
	<article <?php post_class( 'single-post' ); ?>>

		<section class="page-hero">
			<div class="container il-fade">
				<span class="eyebrow"><?php echo esc_html( get_the_date() ); ?></span>
				<h1><?php the_title(); ?></h1>
			</div>
		</section>

		<section class="section section--cream">
			<div class="container il-fade page-content">
				<?php if ( has_post_thumbnail() ) : ?>
					<div class="media-frame"><?php the_post_thumbnail( 'large' ); ?></div>
				<?php endif; ?>
				<?php the_content(); ?>

				<?php
				wp_link_pages(
					array(
						'before' => '<nav class="page-links">' . esc_html__( 'Pages:', 'independent-lasagna' ),
						'after'  => '</nav>',
					)
				);
				?>
			</div>
		</section>

	</article>

	<?php if ( comments_open() || get_comments_number() ) : ?>
		<section class="section section--dark">
			<div class="container">
				<?php comments_template(); ?>
			</div>
		</section>
	<?php endif; ?>

	<?php
endwhile;

get_footer();
