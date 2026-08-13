<?php
/**
 * Single "Work" entry — feature film, wedding film, or show.
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
get_header();

while ( have_posts() ) :
	the_post();
	$video_url   = get_post_meta( get_the_ID(), '_il_video_url', true );
	$watch_url   = get_post_meta( get_the_ID(), '_il_watch_url', true );
	$watch_label = get_post_meta( get_the_ID(), '_il_watch_label', true );
	$terms       = get_the_terms( get_the_ID(), 'il_work_type' );
	$type_label  = ( $terms && ! is_wp_error( $terms ) ) ? $terms[0]->name : '';
	?>

	<section class="page-hero">
		<div class="container il-fade">
			<?php if ( $type_label ) : ?><span class="eyebrow"><?php echo esc_html( $type_label ); ?></span><?php endif; ?>
			<h1><?php the_title(); ?></h1>
			<?php if ( has_excerpt() ) : ?><p class="hero__lede"><?php echo esc_html( get_the_excerpt() ); ?></p><?php endif; ?>
			<?php if ( $watch_url ) : ?>
				<div class="button-row">
					<a class="button button--gold" href="<?php echo esc_url( $watch_url ); ?>" target="_blank" rel="noopener noreferrer">
						<?php echo esc_html( $watch_label ? $watch_label : __( 'Watch Now', 'independent-lasagna' ) ); ?>
					</a>
				</div>
			<?php endif; ?>
		</div>
	</section>

	<section class="section section--cream">
		<div class="container il-fade page-content">
			<?php if ( $video_url ) : ?>
				<?php il_video_embed( $video_url ); ?>
			<?php elseif ( has_post_thumbnail() ) : ?>
				<div class="media-frame media-frame--portrait"><?php the_post_thumbnail( 'il-poster' ); ?></div>
			<?php endif; ?>

			<?php the_content(); ?>
		</div>
	</section>

	<section class="section cta-band">
		<div class="container statement il-fade">
			<h2><?php esc_html_e( 'Want something like this made?', 'independent-lasagna' ); ?></h2>
			<a class="button button--gold" href="<?php echo esc_url( home_url( '/contact/' ) ); ?>"><?php esc_html_e( 'Start a Project', 'independent-lasagna' ); ?></a>
		</div>
	</section>

	<?php
endwhile;

get_footer();
