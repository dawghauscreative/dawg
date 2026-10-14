<?php
/**
 * Default page template (used when no custom template is selected).
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
get_header();

while ( have_posts() ) :
	the_post();
	?>
	<section class="page-hero">
		<div class="container il-fade">
			<h1><?php the_title(); ?></h1>
		</div>
	</section>

	<section class="section section--cream">
		<div class="container il-fade page-content">
			<?php if ( has_post_thumbnail() ) : ?>
				<div class="media-frame"><?php the_post_thumbnail( 'large' ); ?></div>
			<?php endif; ?>
			<?php the_content(); ?>
		</div>
	</section>
	<?php
endwhile;

get_footer();
