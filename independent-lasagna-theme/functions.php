<?php
/**
 * Independent Lasagna theme setup.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'IL_THEME_VERSION', '1.0.0' );

/**
 * Theme support & setup.
 */
function il_setup() {
	load_theme_textdomain( 'independent-lasagna', get_template_directory() . '/languages' );

	add_theme_support( 'title-tag' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'html5', array( 'search-form', 'comment-form', 'comment-list', 'gallery', 'caption', 'style', 'script', 'navigation-widgets' ) );
	add_theme_support( 'responsive-embeds' );
	add_theme_support( 'automatic-feed-links' );
	add_theme_support( 'align-wide' );
	add_theme_support(
		'custom-logo',
		array(
			'height'      => 120,
			'width'       => 360,
			'flex-height' => true,
			'flex-width'  => true,
		)
	);

	set_post_thumbnail_size( 1200, 800, true );
	add_image_size( 'il-poster', 600, 900, true );
	add_image_size( 'il-card', 800, 600, true );

	register_nav_menus(
		array(
			'primary' => __( 'Primary Menu', 'independent-lasagna' ),
			'footer'  => __( 'Footer Menu', 'independent-lasagna' ),
			'social'  => __( 'Social Links Menu', 'independent-lasagna' ),
		)
	);
}
add_action( 'after_setup_theme', 'il_setup' );

/**
 * Enqueue styles & scripts.
 */
function il_scripts() {
	wp_enqueue_style( 'il-fonts', 'https://fonts.googleapis.com/css2?family=Anton&family=Inter:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap', array(), null );
	wp_enqueue_style( 'il-style', get_template_directory_uri() . '/assets/css/main.css', array(), IL_THEME_VERSION );
	wp_enqueue_style( 'il-theme-header', get_stylesheet_uri(), array(), IL_THEME_VERSION );

	wp_enqueue_script( 'il-main', get_template_directory_uri() . '/assets/js/main.js', array(), IL_THEME_VERSION, true );

	if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
		wp_enqueue_script( 'comment-reply' );
	}
}
add_action( 'wp_enqueue_scripts', 'il_scripts' );

/**
 * Widget areas.
 */
function il_widgets_init() {
	register_sidebar(
		array(
			'name'          => __( 'Footer', 'independent-lasagna' ),
			'id'            => 'footer-1',
			'description'   => __( 'Optional widgets shown in the footer, below the main footer columns.', 'independent-lasagna' ),
			'before_widget' => '<div class="footer-widget">',
			'after_widget'  => '</div>',
			'before_title'  => '<h3 class="footer-widget__title">',
			'after_title'   => '</h3>',
		)
	);
}
add_action( 'widgets_init', 'il_widgets_init' );

/**
 * "Work" custom post type — feature films, wedding films, web series & shows.
 * This is the editable, repeatable portfolio content that used to be a pile
 * of static one-off pages; now it is add-in-wp-admin content.
 */
function il_register_work_cpt() {
	register_post_type(
		'il_work',
		array(
			'labels'             => array(
				'name'               => __( 'Work', 'independent-lasagna' ),
				'singular_name'      => __( 'Work', 'independent-lasagna' ),
				'add_new_item'       => __( 'Add New Work', 'independent-lasagna' ),
				'edit_item'          => __( 'Edit Work', 'independent-lasagna' ),
				'all_items'          => __( 'All Work', 'independent-lasagna' ),
				'menu_name'          => __( 'Work', 'independent-lasagna' ),
			),
			'public'             => true,
			/*
			 * No automatic archive: the editable "Work" page (Work page
			 * template) is the canonical /work/ landing page, built from a
			 * WP_Query with a tax filter. Singles still live under /work/.
			 */
			'has_archive'        => false,
			'rewrite'            => array( 'slug' => 'work' ),
			'menu_icon'          => 'dashicons-video-alt3',
			'supports'           => array( 'title', 'editor', 'excerpt', 'thumbnail' ),
			'show_in_rest'       => true,
			'menu_position'      => 5,
		)
	);

	register_taxonomy(
		'il_work_type',
		'il_work',
		array(
			'labels'            => array(
				'name'          => __( 'Work Types', 'independent-lasagna' ),
				'singular_name' => __( 'Work Type', 'independent-lasagna' ),
			),
			'public'            => true,
			'hierarchical'      => true,
			'show_in_rest'      => true,
			'rewrite'           => array( 'slug' => 'work-type' ),
		)
	);
}
add_action( 'init', 'il_register_work_cpt' );

/**
 * Seed the work-type taxonomy with the studio's three lanes on theme
 * activation, so the Work archive has something sensible to filter by
 * immediately instead of an empty term list.
 */
function il_seed_work_types() {
	$terms = array(
		'feature-films' => __( 'Feature Films', 'independent-lasagna' ),
		'wedding-films' => __( 'Wedding Films', 'independent-lasagna' ),
		'shows-series'  => __( 'Shows & Series', 'independent-lasagna' ),
	);
	foreach ( $terms as $slug => $name ) {
		if ( ! term_exists( $slug, 'il_work_type' ) ) {
			wp_insert_term( $name, 'il_work_type', array( 'slug' => $slug ) );
		}
	}
}
add_action( 'after_switch_theme', 'il_seed_work_types' );

/**
 * Meta box: logline, trailer/video embed URL, and an external "watch" link
 * for each Work entry.
 */
function il_work_meta_box() {
	add_meta_box(
		'il_work_details',
		__( 'Work Details', 'independent-lasagna' ),
		'il_work_meta_box_html',
		'il_work',
		'normal',
		'high'
	);
}
add_action( 'add_meta_boxes', 'il_work_meta_box' );

function il_work_meta_box_html( $post ) {
	wp_nonce_field( 'il_work_save', 'il_work_nonce' );
	$video_url  = get_post_meta( $post->ID, '_il_video_url', true );
	$watch_url  = get_post_meta( $post->ID, '_il_watch_url', true );
	$watch_label = get_post_meta( $post->ID, '_il_watch_label', true );
	?>
	<p>
		<label for="il_video_url"><strong><?php esc_html_e( 'Trailer / video embed URL (YouTube, Vimeo)', 'independent-lasagna' ); ?></strong></label><br>
		<input type="url" id="il_video_url" name="il_video_url" class="widefat" value="<?php echo esc_attr( $video_url ); ?>" placeholder="https://www.youtube.com/watch?v=...">
	</p>
	<p>
		<label for="il_watch_url"><strong><?php esc_html_e( 'External "watch now" link (Amazon, Tubi, etc.)', 'independent-lasagna' ); ?></strong></label><br>
		<input type="url" id="il_watch_url" name="il_watch_url" class="widefat" value="<?php echo esc_attr( $watch_url ); ?>" placeholder="https://...">
	</p>
	<p>
		<label for="il_watch_label"><strong><?php esc_html_e( 'Watch link label', 'independent-lasagna' ); ?></strong></label><br>
		<input type="text" id="il_watch_label" name="il_watch_label" class="widefat" value="<?php echo esc_attr( $watch_label ); ?>" placeholder="<?php esc_attr_e( 'Watch Now', 'independent-lasagna' ); ?>">
	</p>
	<?php
}

function il_work_save_meta( $post_id ) {
	if ( ! isset( $_POST['il_work_nonce'] ) || ! wp_verify_nonce( $_POST['il_work_nonce'], 'il_work_save' ) ) {
		return;
	}
	if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
		return;
	}
	if ( ! current_user_can( 'edit_post', $post_id ) ) {
		return;
	}
	if ( isset( $_POST['il_video_url'] ) ) {
		update_post_meta( $post_id, '_il_video_url', esc_url_raw( wp_unslash( $_POST['il_video_url'] ) ) );
	}
	if ( isset( $_POST['il_watch_url'] ) ) {
		update_post_meta( $post_id, '_il_watch_url', esc_url_raw( wp_unslash( $_POST['il_watch_url'] ) ) );
	}
	if ( isset( $_POST['il_watch_label'] ) ) {
		update_post_meta( $post_id, '_il_watch_label', sanitize_text_field( wp_unslash( $_POST['il_watch_label'] ) ) );
	}
}
add_action( 'save_post_il_work', 'il_work_save_meta' );

/**
 * Contact / project-inquiry form handler.
 * Posts to admin-post.php so it works with zero form-plugin dependencies.
 */
function il_handle_contact_submission() {
	if ( ! isset( $_POST['il_contact_nonce'] ) || ! wp_verify_nonce( $_POST['il_contact_nonce'], 'il_contact_submit' ) ) {
		wp_die( esc_html__( 'Security check failed. Please go back and try again.', 'independent-lasagna' ) );
	}

	// Honeypot — real users never fill this in.
	if ( ! empty( $_POST['il_website'] ) ) {
		wp_safe_redirect( add_query_arg( 'il_contact', 'sent', wp_get_referer() ?: home_url( '/' ) ) );
		exit;
	}

	$name    = isset( $_POST['il_name'] ) ? sanitize_text_field( wp_unslash( $_POST['il_name'] ) ) : '';
	$email   = isset( $_POST['il_email'] ) ? sanitize_email( wp_unslash( $_POST['il_email'] ) ) : '';
	$phone   = isset( $_POST['il_phone'] ) ? sanitize_text_field( wp_unslash( $_POST['il_phone'] ) ) : '';
	$service = isset( $_POST['il_service'] ) ? sanitize_text_field( wp_unslash( $_POST['il_service'] ) ) : '';
	$message = isset( $_POST['il_message'] ) ? sanitize_textarea_field( wp_unslash( $_POST['il_message'] ) ) : '';

	$redirect = wp_get_referer() ?: home_url( '/' );

	if ( empty( $name ) || ! is_email( $email ) || empty( $message ) ) {
		wp_safe_redirect( add_query_arg( 'il_contact', 'error', $redirect ) );
		exit;
	}

	$to      = apply_filters( 'il_contact_recipient', 'info@independentlasagna.com' );
	$subject = sprintf( '[%s] New inquiry from %s', get_bloginfo( 'name' ), $name );
	$body    = "Name: {$name}\nEmail: {$email}\nPhone: {$phone}\nService: {$service}\n\nMessage:\n{$message}";
	$headers = array( "Reply-To: {$name} <{$email}>" );

	wp_mail( $to, $subject, $body, $headers );

	wp_safe_redirect( add_query_arg( 'il_contact', 'sent', $redirect ) );
	exit;
}
add_action( 'admin_post_nopriv_il_contact_submit', 'il_handle_contact_submission' );
add_action( 'admin_post_il_contact_submit', 'il_handle_contact_submission' );

/**
 * Excerpt length & "read more" marker tuned for the News/blog grid.
 */
add_filter(
	'excerpt_length',
	function () {
		return 24;
	},
	999
);
add_filter(
	'excerpt_more',
	function () {
		return '&hellip;';
	}
);

/**
 * Small template helpers.
 */
require get_template_directory() . '/inc/template-tags.php';
