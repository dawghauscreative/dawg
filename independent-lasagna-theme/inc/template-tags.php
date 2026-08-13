<?php
/**
 * Reusable template helpers.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Print the social links menu as icon links. Falls back to the studio's
 * known public profiles if no "Social Links Menu" has been assigned yet,
 * so the footer never ships empty.
 */
function il_social_links() {
	if ( has_nav_menu( 'social' ) ) {
		wp_nav_menu(
			array(
				'theme_location' => 'social',
				'container'      => false,
				'menu_class'     => 'social-links',
				'depth'          => 1,
				'link_before'    => '<span class="screen-reader-text">',
				'link_after'     => '</span>',
			)
		);
		return;
	}

	$defaults = array(
		'Instagram' => 'https://instagram.com/independentlasagna',
		'Facebook'  => 'https://facebook.com/IndependentLasagna',
	);
	echo '<ul class="social-links">';
	foreach ( $defaults as $label => $url ) {
		printf(
			'<li><a href="%1$s" target="_blank" rel="noopener noreferrer">%2$s</a></li>',
			esc_url( $url ),
			esc_html( $label )
		);
	}
	echo '</ul>';
}

/**
 * Card markup for a single "Work" entry (feature film, wedding film, show).
 */
function il_work_card( $post_id, $delay_ms = 0 ) {
	$title      = get_the_title( $post_id );
	$excerpt    = get_the_excerpt( $post_id );
	$permalink  = get_permalink( $post_id );
	$watch_url  = get_post_meta( $post_id, '_il_watch_url', true );
	$watch_label = get_post_meta( $post_id, '_il_watch_label', true );
	$terms      = get_the_terms( $post_id, 'il_work_type' );
	$type_label = ( $terms && ! is_wp_error( $terms ) ) ? $terms[0]->name : '';
	?>
	<article class="work-card il-fade" style="animation-delay:<?php echo esc_attr( $delay_ms ); ?>ms">
		<a href="<?php echo esc_url( $permalink ); ?>" class="work-card__media">
			<?php if ( has_post_thumbnail( $post_id ) ) : ?>
				<?php echo get_the_post_thumbnail( $post_id, 'il-poster' ); ?>
			<?php else : ?>
				<span class="work-card__media-placeholder" aria-hidden="true"></span>
			<?php endif; ?>
		</a>
		<div class="work-card__body">
			<?php if ( $type_label ) : ?><span class="eyebrow"><?php echo esc_html( $type_label ); ?></span><?php endif; ?>
			<h3><a href="<?php echo esc_url( $permalink ); ?>"><?php echo esc_html( $title ); ?></a></h3>
			<?php if ( $excerpt ) : ?><p><?php echo esc_html( wp_trim_words( $excerpt, 20 ) ); ?></p><?php endif; ?>
			<?php if ( $watch_url ) : ?>
				<a class="button button--outline button--small" href="<?php echo esc_url( $watch_url ); ?>" target="_blank" rel="noopener noreferrer">
					<?php echo esc_html( $watch_label ? $watch_label : __( 'Watch Now', 'independent-lasagna' ) ); ?>
				</a>
			<?php endif; ?>
		</div>
	</article>
	<?php
}

/**
 * Render a video embed from a raw YouTube/Vimeo URL using WordPress' own
 * oEmbed support, wrapped for the responsive-embeds theme support.
 */
function il_video_embed( $url ) {
	if ( empty( $url ) ) {
		return;
	}
	echo '<div class="video-embed">';
	echo wp_oembed_get( esc_url( $url ) ); // phpcs:ignore WordPress.Security.EscapeOutput
	echo '</div>';
}
